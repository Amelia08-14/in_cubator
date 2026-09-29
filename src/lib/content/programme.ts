// Contenu éditorial issu du catalogue IN NETWORK V3 (11/2025).
// Les titres des six étapes et la liste des services sont ceux du catalogue ;
// les descriptions sont rédigées à partir de ces intitulés et restent à valider
// par l'équipe IN-CUBATOR (aucune durée ni chiffre n'y est avancé).

export type ProgrammeStep = {
  n: number;
  short: string;
  title: string;
  summary: string;
  bullets: string[];
  photo: string;
  photoAlt: string;
};

export const PROGRAMME_STEPS: ProgrammeStep[] = [
  {
    n: 1,
    short: "Diagnostic",
    title: "Diagnostic & structuration du projet",
    summary:
      "On regarde votre idée sous tous les angles — marché, offre, équipe, ressources — pour la transformer en projet structuré, avec une feuille de route claire.",
    bullets: ["Analyse du marché local", "Cadrage du modèle et du positionnement", "Feuille de route priorisée"],
    photo: "/photos/gen/programme.webp",
    photoAlt: "Une équipe de fondateurs devant un tableau blanc couvert de post-it et d'une feuille de route en quatre trimestres",
  },
  {
    n: 2,
    short: "Accompagnement",
    title: "Accompagnement personnalisé & accélération",
    summary:
      "Un suivi sur mesure : conseils ciblés, experts métier et points réguliers avec l'équipe pour lever chaque blocage au fil de l'avancement.",
    bullets: ["Suivi personnalisé par l'équipe", "Mentors et experts sectoriels", "Objectifs et tâches suivis en ligne"],
    photo: "/photos/reception.webp",
    photoAlt: "Deux membres de l'équipe accueillent un porteur de projet à l'accueil",
  },
  {
    n: 3,
    short: "Test terrain",
    title: "Phase de test & validation terrain",
    summary:
      "Confrontez votre offre à la réalité : prototype, premiers utilisateurs, retours concrets. On ajuste avant d'investir davantage.",
    bullets: ["Prototype et premiers retours", "Validation auprès de vrais utilisateurs", "Décisions fondées sur les faits"],
    photo: "/photos/gen/terrain.webp",
    photoAlt: "Une fondatrice présente le prototype de son application sur tablette à une commerçante, dans une boutique d'Alger",
  },
  {
    n: 4,
    short: "Réseau",
    title: "Mise en réseau & visibilité",
    summary:
      "Votre startup rejoint la communauté IN : mentors, investisseurs, partenaires et événements du groupe. Elle gagne une vitrine publique et une Deal Room sécurisée.",
    bullets: ["Vitrine publique de la startup", "Deal Room pour les investisseurs", "Événements et afterworks IN NETWORK"],
    photo: "/photos/terrasse.webp",
    photoAlt: "Jardin terrasse de 150 m² d'IN NETWORK",
  },
  {
    n: 5,
    short: "Formations",
    title: "Formations & ateliers pratiques",
    summary:
      "Des ateliers concrets, animés par des praticiens, sur ce qu'un fondateur doit maîtriser — de la création juridique d'entreprise au pitch.",
    bullets: ["Atelier de création juridique d'entreprise", "Salle de formation équipée", "Workshops thématiques du groupe"],
    photo: "/photos/gen/formation.webp",
    photoAlt: "Un atelier pratique : une formatrice devant un tableau de modèle économique, huit participants prenant des notes",
  },
  {
    n: 6,
    short: "Lancement",
    title: "Lancement & mise en marché",
    summary:
      "Le groupe IN vous accompagne pour sortir : structure juridique, domiciliation, communication et développement web, jusqu'à la mise en marché.",
    bullets: ["Création juridique et domiciliation", "Identité, communication, site web", "Passage à l'échelle avec le réseau"],
    photo: "/photos/gen/lancement.webp",
    photoAlt: "Quatre jeunes professionnels célèbrent le lancement de leur produit autour d'un ordinateur",
  },
];

export const GROUP_SERVICES = [
  {
    name: "Domiciliation",
    text: "Une adresse stratégique à Hydra et la réception sécurisée de votre courrier.",
  },
  {
    name: "Création juridique",
    text: "Nom commercial, statuts, registre de commerce, NIF, NIS, CASNOS, compte bancaire : neuf démarches prises en charge.",
  },
  {
    name: "Fiscalité & comptabilité",
    text: "Tenue comptable, bilan annuel, déclarations fiscales et sociales, commissariat aux comptes.",
  },
  {
    name: "Administration & RH",
    text: "Recrutement, contrats de travail, paie, rédaction de contrats, dépôt de marques.",
  },
  {
    name: "Communication",
    text: "Stratégie, identité visuelle, communication digitale et print, relations presse, événementiel.",
  },
  {
    name: "Développement web",
    text: "Sites, applications mobiles et intégration de paiements locaux.",
  },
];

export const EQUIPMENTS = [
  { name: "Accès 24h/7j", text: "Votre espace, votre temps, avec vidéosurveillance." },
  { name: "Jardin terrasse de 150 m²", text: "Pour se ressourcer, échanger et stimuler la créativité." },
  { name: "Espace café et restauration", text: "Boissons de qualité et repas équilibrés toute la journée." },
  { name: "Internet haut débit", text: "Une connexion ultra-rapide, sans interruption." },
  { name: "Projecteur 8K", text: "Des présentations nettes, pour vos échanges et vos pitchs." },
  { name: "Impression et photocopie", text: "Toujours à disposition, pour simplifier l'administratif." },
];

export const DIASPORA_PACKS = [
  {
    name: "Pack 01",
    price: "185 652 DZD",
    items: ["Domiciliation annuelle (un contrat de location pour une année)", "Workshop création juridique d'entreprise : atelier pratique pour comprendre les étapes"],
  },
  {
    name: "Pack 02",
    price: "255 652 DZD",
    items: ["Domiciliation annuelle", "Création juridique d'entreprise : prise en charge complète de la création de votre entreprise"],
  },
  {
    name: "Pack 03",
    price: "Sur devis",
    items: ["Domiciliation", "Création juridique d'entreprise", "Comptabilité", "Secrétariat"],
  },
  {
    name: "Pack 04",
    price: "Sur devis",
    items: ["Domiciliation", "Création juridique d'entreprise", "Comptabilité", "Secrétariat", "Marketing"],
  },
  {
    name: "Pack 05",
    price: "Sur devis",
    items: ["Domiciliation", "Création juridique d'entreprise", "Comptabilité", "Secrétariat", "Marketing", "RH & formation"],
  },
];
