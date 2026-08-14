const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.candidature.deleteMany({
    where: {
      startup: {
        nom: 'NovaTech Solutions'
      }
    }
  });
  console.log('Deleted candidatures:', result);
  
  const result2 = await prisma.startupProfile.deleteMany({
    where: { nom: 'NovaTech Solutions' }
  });
  console.log('Deleted startup profiles:', result2);
}

main().catch(console.error).finally(() => prisma.$disconnect());
