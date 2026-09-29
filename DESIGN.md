# Design system — IN-CUBATOR

Famille visuelle **La Maison IN Groupe** (logo IN-CUBATOR, catalogue IN NETWORK V3). Source de vérité des tokens : [src/app/globals.css](src/app/globals.css).

## Principe

Le site est un **parcours** : six étapes d'incubation reliées par une ligne orange, chacune marquée par un hexagone violet. Les formes angulaires (facettes, hexagones) viennent du catalogue ; le cube ouvert bleu / violet / orange vient du logo.

## Couleur (le beige porte les surfaces, le violet devient l'encre et l'accent)

| Rôle | Token | Valeur |
| --- | --- | --- |
| Fond principal | `paper` | `#f5eee3` (beige chaud) |
| Fond clair alterné | `cream` | `#fbf7ef` |
| Fond profond / sections alternées | `paper-deep` | `#ebe1d0` |
| Facettes, cadres d'images | `sand` | `#ddd0bb` |
| Filets | `line` | `#dccfba` |
| Titres, logo, blocs facettés | `violet-dark` | `#3e2a57` |
| Barre latérale des espaces connectés | `violet-deep` | `#2c1a40` |
| Accent secondaire | `violet-main` | `#964594` |
| Action / signal | `orange-accent` | `#d44835` (`orange-deep` `#b23a29` pour le texte sur beige) |
| Information | `blue-main` | `#1f5aa6` |
| Texte secondaire | `gray-main` | `#5d5361` (gris violet-brun) |

Le site public est entièrement beige : en-tête et pied de page compris. Le violet n'y apparaît qu'en titres, logo, hexagones d'étapes et quelques blocs facettés (tuile de candidature, bloc Deal Room). L'orange porte les actions et la bande « +250 entreprises ». Les espaces connectés ont un fond beige et une barre latérale violette.

## Typographie

- **Roboto Slab** (`font-serif`) : titres, chiffres clés. C'est la police du logo et des titres du catalogue.
- **Figtree** (`font-sans`) : texte courant et interfaces.
- Titres en `text-wrap: balance`, corps en `pretty`. Chiffres tabulaires (`.tabular`) dans les tableaux, KPI et dates.

## Formes et composants

- `.facet-tr`, `.facet-bl`, `.facet-photo` : coins coupés en biseau (photos, panneaux). `.hex` : hexagone (numéros d'étapes, avatars, puces).
- Rayons resserrés globalement (`--radius-*`) : les anciennes classes `rounded-xl/2xl/3xl` restent angulaires.
- Boutons `.btn` + `.btn-primary | .btn-violet | .btn-ghost-light | .btn-ghost-dark` (coin biseauté). Champs `.field`.
- Listes éditoriales (filet violet + hexagone orange) plutôt que grilles de cartes ; pas d'eyebrow au-dessus des titres.
- Ombres : `shadow-lift` (cartes), `shadow-deep` (panneaux superposés).

## Mouvement (GSAP + Lenis)

- **Parcours** (accueil) : section épinglée sur bureau, la ligne orange se dessine au scroll, l'étape active change le texte et la photo. Liste verticale sur mobile et sous `prefers-reduced-motion`.
- Cube du logo qui s'assemble à l'arrivée ; entrées au scroll (`Reveal`, expo-out, contenu visible par défaut) ; compteurs de la bande réseau ; marquee des équipements.
- Lenis (défilement lissé) uniquement sur le site public ; les espaces `/admin` et `/espace*` gardent le scroll natif.

## Interfaces d'opération (admin, CRM)

Barre latérale commune [AppSidebar](src/components/layouts/AppSidebar.tsx) (tiroir sur mobile). Le CRM suit le vocabulaire Odoo : kanban par étape, priorité en étoiles, activités planifiées, barre d'étapes cliquable sur la fiche.

## Assets et provenance des images

- **Vraies photos** d'IN NETWORK (catalogue V3), dans `public/photos/` : tableau blanc « Product Roadmap », accueil, terrasse, salle de formation, bureaux. Étalonnées d'un ton chaud commun.
- **Images éditoriales générées** (Higgsfield, modèle `gpt_image_2_5`, septembre 2026), dans `public/photos/gen/` : `programme`, `terrain`, `formation`, `lancement` (étapes du parcours), `candidature`, `mentors`, `startups`, `contact`, `alger`. Ce sont des illustrations : elles ne représentent ni les locaux réels ni de vraies personnes, et doivent rester présentées comme telles (jamais comme témoignages ou photos de l'équipe).
- Logo `public/logo.png` (fond clair), variante `public/logo-light.png` pour les fonds violets (barre latérale).
