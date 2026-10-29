import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { COMPANIES_DATA } from '../../src/data/companies.js';
import { INTERVIEWERS_DATA } from '../../src/data/interviewers.js';

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFile), '../..');
dotenv.config({ path: path.join(projectRoot, '.env') });

const prisma = new PrismaClient();

async function seed() {
  for (const company of COMPANIES_DATA) {
    const savedCompany = await prisma.company.upsert({
      where: { slug: company.slug },
      create: {
        slug: company.slug,
        name: company.name,
        category: company.category,
        logoUrl: company.logo,
        overview: company.overview,
        roles: company.popularRoles,
        topics: company.topTopics,
        pattern: company.pattern,
        isDemo: true
      },
      update: {
        name: company.name,
        category: company.category,
        logoUrl: company.logo,
        overview: company.overview,
        roles: company.popularRoles,
        topics: company.topTopics,
        pattern: company.pattern,
        isDemo: true
      }
    });

    for (const item of company.freqQuestions || []) {
      const question = await prisma.question.upsert({
        where: { title: item.title },
        create: {
          title: item.title,
          topic: company.topTopics[0] || 'Interview preparation',
          difficulty: 'Unspecified',
          isDemo: true
        },
        update: { isDemo: true }
      });
      await prisma.companyQuestion.upsert({
        where: { companyId_questionId: { companyId: savedCompany.id, questionId: question.id } },
        create: { companyId: savedCompany.id, questionId: question.id },
        update: {}
      });
    }
  }

  for (const mentor of INTERVIEWERS_DATA) {
    const id = createHash('sha256').update(mentor.id).digest('hex').slice(0, 24);
    await prisma.mentorProfile.upsert({
      where: { id },
      create: {
        id,
        ownerKey: `demo:${id}`,
        companyName: mentor.company,
        companySlug: mentor.companySlug,
        roleTitle: mentor.role,
        biography: mentor.bio,
        topics: mentor.topics,
        price: mentor.hourlyRate,
        status: 'PENDING',
        isDemo: true
      },
      update: {
        ownerKey: `demo:${id}`,
        companyName: mentor.company,
        companySlug: mentor.companySlug,
        roleTitle: mentor.role,
        biography: mentor.bio,
        topics: mentor.topics,
        price: mentor.hourlyRate,
        status: 'PENDING',
        isDemo: true
      }
    });
  }
}

seed()
  .catch((error) => {
    console.error('Demo data seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
