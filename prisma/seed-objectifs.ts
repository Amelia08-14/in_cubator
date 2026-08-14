import { PrismaClient, StatutObjectif } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const startupProfile = await prisma.startupProfile.findFirst({
    where: { nom: 'NovaTech Solutions' }
  });

  const admin = await prisma.user.findFirst({
    where: { email: 'admin@in-cubator.dz' }
  });

  if (!startupProfile || !admin) {
    console.error("Startup ou Admin introuvable.");
    return;
  }

  // Create an objective
  const objectif = await prisma.objectif.create({
    data: {
      startupId: startupProfile.id,
      titre: "Finaliser le MVP pour la cohorte",
      description: "Le produit doit être prêt pour les premiers tests utilisateurs.",
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // In 30 days
      statut: StatutObjectif.EN_COURS,
      creePar: admin.id,
      taches: {
        create: [
          {
            startupId: startupProfile.id,
            titre: "Déployer la base de données de production",
            statut: StatutObjectif.TERMINE,
            dateEcheance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            creePar: admin.id,
          },
          {
            startupId: startupProfile.id,
            titre: "Intégrer le système de paiement",
            statut: StatutObjectif.EN_COURS,
            dateEcheance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
            creePar: admin.id,
          },
          {
            startupId: startupProfile.id,
            titre: "Lancer la campagne de beta-testing",
            statut: StatutObjectif.A_FAIRE,
            dateEcheance: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // In 15 days
            creePar: admin.id,
          }
        ]
      }
    }
  });

  console.log("Objectifs seedés avec succès !", objectif);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
