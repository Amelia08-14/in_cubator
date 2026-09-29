# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Porteurs de projet / startups** (Algérie et diaspora) : candidatent au programme, suivent leur feuille de route, réservent des mentors, alimentent leur Deal Room.
- **Mentors & experts** : publient leurs disponibilités, accompagnent les startups.
- **Investisseurs** : parcourent la vitrine, demandent l'accès aux Deal Rooms, suivent un portefeuille et une watchlist.
- **Équipe IN-CUBATOR (admin / gestionnaires)** : évaluent les candidatures, pilotent les cohortes, gèrent mentors, Open Innovation, bibliothèque et — nouveauté — le CRM commercial (leads et pipeline).
- **Partenaires corporate** (hôpitaux, industriels, universités, institutions) : Open Innovation.

## Product Purpose

IN-CUBATOR est la plateforme de l'incubateur de La Maison IN Groupe (Alger, Hydra), adossé à IN NETWORK (coworking, +250 entreprises, +20 startups accompagnées). Elle transforme des idées en projets concrets via un programme d'incubation en six étapes, met en relation startups, mentors et investisseurs, et donne à l'équipe un outil unique (candidatures, cohortes, CRM/pipeline) pour piloter l'ensemble. Elle accompagne aussi la diaspora qui souhaite entreprendre ou investir en Algérie (Out-Cubator).

## Positioning

Le seul incubateur algérien adossé à un réseau de coworking national et à un groupe de services (domiciliation, juridique, fiscalité, communication, développement web) : la startup dispose d'un lieu, d'un programme, d'experts et d'investisseurs sous un même toit, en ligne comme sur place.

## Operating Context

- Programme d'incubation en 6 étapes : 01 Diagnostic & structuration du projet · 02 Accompagnement personnalisé & accélération · 03 Phase de test & validation terrain · 04 Mise en réseau & visibilité · 05 Formations & ateliers pratiques · 06 Lancement & mise en marché.
- Filiales et produits liés : IN NETWORK (coworking, in-network.dz), IN ACADEMY, IN GROUP.
- Langue : français ; devise locale DZD.
- Stack existante : Next.js 16 / React 19 / Tailwind 4 (frontend), Express 5 + Prisma + MySQL (API, migration en cours), auth par cookies httpOnly.

## Capabilities and Constraints

- Espaces authentifiés par rôle : startup (`/espace`), mentor (`/espace-mentor`), investisseur (`/espace-investisseur`), administration (`/admin`).
- CRM (décidé) : un lead peut représenter tout profil (startup, investisseur, partenaire corporate, mentor, diaspora) ; pipeline kanban façon Odoo calquée sur les six étapes d'incubation, plus les issues Gagné/Perdu ; **pas de montant financier** — suivi par volume, score, priorité, probabilité par étape et conversion.
- Hors périmètre tant que non cadré : paiement, facturation, commissions, wallet.
- Toute donnée factuelle (prix, chiffres, clients) vient du catalogue IN NETWORK V3 ou du dépôt ; rien n'est inventé.

## Brand Commitments

- Identité alignée sur IN NETWORK / La Maison IN Groupe : violet profond, orange-rouge, bleu, fonds neutres clairs, formes angulaires, slab serif (logo IN-CUBATOR en Roboto Slab avec pictogramme cube ouvert bleu / violet / orange). Le site doit ressembler à la famille IN NETWORK tout en gardant sa propre personnalité d'incubateur.
- Logo : `public/logo.png`.

## Evidence on Hand

- Catalogue « IN Network V3 11/2025 » (pages : processus d'incubation, équipements, réseau national, packs diaspora).
- Chiffres du catalogue : +250 entreprises, +20 startups accompagnées, accès 24/7, jardin terrasse 150 m², réseau d'espaces sur le territoire national.
- Absents : témoignages nominatifs, résultats chiffrés de cohortes, logos de partenaires — ne pas les inventer.

## Product Principles

1. Un seul parcours lisible : candidater → être accompagné → être visible des investisseurs.
2. La crédibilité vient du concret (lieu, programme, experts), pas de la promesse.
3. Chaque rôle a un espace clair ; l'administrateur voit tout le pipeline en un coup d'œil.
4. Le CRM sert l'action : prochaine étape, relance, propriétaire du lead.

## Accessibility & Inclusion

Français par défaut ; contrastes AA ; respect de `prefers-reduced-motion` ; interfaces utilisables au clavier.
