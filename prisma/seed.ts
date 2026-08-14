import { PrismaClient, Role, StadeStartup, TypePartenaire, StatutCohorte, CategorieRessource, StatutCandidature } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('password123', 12)

  // 1. Create ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@in-cubator.dz' },
    update: {},
    create: {
      email: 'admin@in-cubator.dz',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  })
  console.log({ admin })

  // 2. Create a GESTIONNAIRE
  const gestionnaire = await prisma.user.upsert({
    where: { email: 'gestionnaire@in-cubator.dz' },
    update: {},
    create: {
      email: 'gestionnaire@in-cubator.dz',
      passwordHash: adminPassword,
      role: Role.GESTIONNAIRE,
    },
  })
  console.log({ gestionnaire })

  // 3. Create a Cohort
  const cohorte = await prisma.cohorte.create({
    data: {
      nom: "Cohorte 2026-S1",
      dateDebut: new Date('2026-09-01'),
      dateFin: new Date('2027-03-01'),
      statut: StatutCohorte.OUVERTE_CANDIDATURES,
    }
  })

  // 4. Create a Startup
  const startupUser = await prisma.user.upsert({
    where: { email: 'startup@in-cubator.dz' },
    update: {},
    create: {
      email: 'startup@in-cubator.dz',
      passwordHash: userPassword,
      role: Role.PORTEUR_STARTUP,
    },
  })

  // Ensure we don't recreate the profile if it already exists (upsert logic for relations is trickier so we just create if not exists for the MVP seed)
  let startupProfile = await prisma.startupProfile.findUnique({ where: { userId: startupUser.id } });
  if (!startupProfile) {
    startupProfile = await prisma.startupProfile.create({
      data: {
        userId: startupUser.id,
        nom: "NovaTech Solutions",
        secteurs: ["HealthTech", "IA"],
        stade: StadeStartup.PROTOTYPE,
        description: "Une startup innovante qui utilise l'IA pour la santé.",
        pitchResume: "L'IA au service de la santé africaine.",
        siteWeb: "https://novatech.dz",
        besoins: ["Financement", "Mentorat technique"],
        cohorteId: cohorte.id,
        visiblePublic: true,
        membres: {
          create: [
            { nom: "Amine CEO", role: "CEO", linkedin: "https://linkedin.com/in/amine" },
            { nom: "Sarah CTO", role: "CTO", linkedin: "https://linkedin.com/in/sarah" }
          ]
        },
        candidature: {
          create: {
            cohorteId: cohorte.id,
            reponses: { "q1": "Reponse 1", "q2": "Reponse 2" },
            statut: StatutCandidature.ACCEPTEE,
            score: 85,
          }
        }
      }
    })
  }
  console.log({ startupProfile })

  // 5. Create Mentors
  const mentorsData = [
    { email: 'mentor1@in-cubator.dz', nom: 'Yacine Khelifi', exp: ['Marketing', 'Levée de fonds'], sec: ['SaaS', 'FinTech'] },
    { email: 'mentor2@in-cubator.dz', nom: 'Inès Bensalem', exp: ['Strategy', 'Produit'], sec: ['HealthTech', 'MedTech'] },
    { email: 'mentor3@in-cubator.dz', nom: 'Karim Benyahia', exp: ['Vente', 'Croissance'], sec: ['EdTech', 'SaaS'] },
  ];

  for (const m of mentorsData) {
    const mUser = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: { email: m.email, passwordHash: userPassword, role: Role.MENTOR_EXPERT },
    });

    let mProfile = await prisma.mentorProfile.findUnique({ where: { userId: mUser.id }});
    if (!mProfile) {
      await prisma.mentorProfile.create({
        data: {
          userId: mUser.id,
          nomComplet: m.nom,
          expertise: m.exp,
          secteurs: m.sec,
          langues: ["Français", "Anglais"],
          bio: `Expert en ${m.exp[0]}.`,
          tarifIndicatif: "Bénévolat",
          noteMoyenne: 4.5 + Math.random() * 0.5,
          disponibilites: {
            create: [
              { dateDebut: new Date(Date.now() + 86400000 * 2), dateFin: new Date(Date.now() + 86400000 * 2 + 3600000) },
              { dateDebut: new Date(Date.now() + 86400000 * 5), dateFin: new Date(Date.now() + 86400000 * 5 + 3600000) }
            ]
          }
        }
      });
    }
  }

  // 6. Create Investors
  const investorsData = [
    { email: 'investisseur1@in-cubator.dz', org: 'Algeria Ventures', tickets: [50000, 500000] },
    { email: 'investisseur2@in-cubator.dz', org: 'Casbah Capital', tickets: [10000, 100000] },
    { email: 'investisseur3@in-cubator.dz', org: 'Yassir Angels', tickets: [20000, 200000] },
  ];

  for (const inv of investorsData) {
    const iUser = await prisma.user.upsert({
      where: { email: inv.email },
      update: {},
      create: { email: inv.email, passwordHash: userPassword, role: Role.INVESTISSEUR },
    });

    let iProfile = await prisma.investorProfile.findUnique({ where: { userId: iUser.id }});
    if (!iProfile) {
      await prisma.investorProfile.create({
        data: {
          userId: iUser.id,
          organisation: inv.org,
          secteursCibles: ["HealthTech", "FinTech", "SaaS"],
          stadesCibles: ["EARLY_TRACTION", "SCALE"],
          ticketMin: inv.tickets[0],
          ticketMax: inv.tickets[1],
        }
      });
    }
  }

  // 7. Create a Ressource
  await prisma.ressource.create({
    data: {
      titre: "Modèle de Business Plan",
      description: "Un template complet pour préparer votre BP.",
      categorie: CategorieRessource.BUSINESS_PLAN,
      fichierUrl: "https://example.com/bp-template.pdf",
      tags: ["Template", "Finance"],
      publieLe: new Date(),
    }
  })

  console.log("Seeding finished successfully.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
