export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function parseInput(schema, input) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', parsed.error.issues[0]?.message || 'Invalid request.');
  }
  return parsed.data;
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.code === 'P2002') {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'This record already exists.' } });
  }
  if (error?.code === 'P2025') {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The requested record was not found.' } });
  }
  if (error?.code === 'P2023') {
    return res.status(400).json({ error: { code: 'INVALID_ID', message: 'The requested record ID is invalid.' } });
  }
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } });
  }

  const status = error instanceof ApiError ? error.status : 500;
  const code = error instanceof ApiError ? error.code : 'INTERNAL_ERROR';
  const message = error instanceof ApiError ? error.message : 'An unexpected error occurred.';
  if (status >= 500) {
    req.log?.error({ err: error, requestId: req.id }, 'Request failed');
  }
  return res.status(status).json({ error: { code, message, requestId: req.id } });
}
