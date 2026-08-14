const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const startups = await prisma.startupProfile.findMany();
  console.log(startups.map(s => ({id: s.id, nom: s.nom})));
}

main().catch(console.error).finally(() => prisma.$disconnect());
