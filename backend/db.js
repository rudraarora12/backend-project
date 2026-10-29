import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

function describeMongoUri(value) {
  if (!value) return 'not configured';
  try {
    const parsed = new URL(value);
    const pathname = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : '[default-db]';
    return `${parsed.protocol}//[credentials-hidden]@${parsed.hostname}${pathname}`;
  } catch {
    return value.replace(/(:\/\/)[^/@\s]+@/, '$1[credentials-hidden]@');
  }
}

function sanitizeDiagnostic(value) {
  return String(value)
    .replace(/mongodb(?:\+srv)?:\/\/[^\s"']+/gi, 'mongodb://[connection-string-hidden]')
    .replace(/(password|secret|token)(\s*[:=]\s*)[^,\s"' }]+/gi, '$1$2[hidden]');
}

function connectionFailure(error) {
  const detail = sanitizeDiagnostic(error instanceof Error ? error.message : error);
  if (/authenticationfailed|scram failure|bad auth|authentication failed/i.test(detail)) {
    return {
      code: 'DATABASE_AUTH_FAILED',
      hint: 'Check the Atlas Database Access username and password. Use the database-user password, not the Atlas website password, and percent-encode reserved URI characters.'
    };
  }
  if (/dns resolution|no record found|ENOTFOUND|EAI_AGAIN/i.test(detail)) {
    return {
      code: 'DATABASE_DNS_FAILED',
      hint: 'Check the Atlas cluster hostname in MONGODB_URI and verify DNS/network access.'
    };
  }
  if (/database must be defined|database.*connection string/i.test(detail)) {
    return {
      code: 'DATABASE_NAME_MISSING',
      hint: 'Add the development database name after the Atlas hostname in MONGODB_URI.'
    };
  }
  return {
    code: 'DATABASE_CONNECTION_FAILED',
    hint: 'Check MONGODB_URI, Atlas network access, and cluster availability.'
  };
}

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Add it to the project-root .env file before starting the API.');
  }

  let uri;
  try {
    uri = new URL(process.env.MONGODB_URI);
  } catch {
    throw new Error('MONGODB_URI is not a valid MongoDB connection URL.');
  }
  let decodedPassword;
  try {
    decodedPassword = decodeURIComponent(uri.password);
  } catch {
    throw new Error('MONGODB_URI contains invalid percent-encoding. Percent-encode reserved characters in the Atlas password.');
  }
  if (/^<.*>$/.test(decodedPassword)) {
    const error = new Error('MONGODB_URI still contains a password placeholder. Set the Atlas Database Access user password in the project-root .env file.');
    error.code = 'MONGODB_PASSWORD_PLACEHOLDER';
    error.hint = 'In Atlas Database Access, reset or copy the database user password, then replace the placeholder in .env. Do not use the Atlas website account password.';
    throw error;
  }

  try {
    await prisma.$connect();
    await checkDatabaseConnection();
  } catch (error) {
    const detail = sanitizeDiagnostic(error instanceof Error ? error.message : error);
    const failure = connectionFailure(detail);
    const connection = describeMongoUri(process.env.MONGODB_URI);
    const wrapped = new Error(`MongoDB connection failed for ${connection}. ${detail}`, { cause: error });
    wrapped.code = failure.code;
    wrapped.hint = failure.hint;
    throw wrapped;
  }
}

export async function checkDatabaseConnection() {
  await prisma.$runCommandRaw({ ping: 1 });
}
