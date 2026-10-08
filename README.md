# Le Reliquaire · Inktober 2026, jour 2

Enquête en équipe inspirée des chasses au trésor géolocalisées. Le scénario fourni explore six lieux de La Défense, dans un ordre libre, sur 2 h maximum.

**[Jouer à la version hébergée](https://inktober-2026.emmanuel-galland117.chatgpt.site/reliquaire/)** · **[Calendrier Inktober](https://egalland.github.io/)**

La version hébergée utilise actuellement l'accès privé du Site Inktober. Ce dépôt public contient le code du jeu, son serveur et ses tests ; il ne contient aucune donnée de session ni photo de participant.

## Utilisation

Dans « Maître de jeu », choisir l'enquête et créer une session. Partager son lien ou son code, laisser les équipes ajouter leurs membres, puis donner le départ commun. Chaque équipe utilise un téléphone capitaine ; un code de reprise permet de changer de téléphone et révoque l'accès précédent.

Le mode **terrain** exige une position récente dans le cercle GPS pour ouvrir, répondre, prendre un indice ou passer une épreuve. Le mode **essai sur écran** permet de jouer sans GPS et de remettre une épreuve à zéro. La supervision peut accorder un accès sans GPS ou valider une épreuve ; ces interventions sont historisées.

Six épreuves indépendantes peuvent être parcourues dans n'importe quel ordre. Le carnet raconte leur ordre de découverte. Le rituel final se débloque une fois tous les fragments obtenus, y compris les épreuves passées.

## Règles

- 100 points par énigme par défaut, −20 par indice ; score minimum 0.
- Passer donne la relique avec 0 point, définitivement pour cette session.
- Une mauvaise réponse bloque l'épreuve pendant 15 secondes. Fermer la fenêtre ou sortir puis revenir ne réinitialise pas ce délai.
- Classement : points décroissants, erreurs × 15 secondes croissantes, puis temps de réalisation hors pauses.
- Photos sans IA : une par lieu après sa relique, jusqu'à 30 points, attribués par le maître de jeu. La galerie est partagée entre les équipes après clôture.
- Durée maximale configurée : 120 minutes. Estimations du scénario fourni : 50 min d'énigmes, 20–30 min de marche, 15–20 min de photos et finale. Repérage nécessaire pour vérifier travaux et réception GPS.

La suggestion d'ordre utilise les distances à vol d'oiseau. Elle ne calcule pas les passages piétons ni les détours. GPS et podomètre nécessitent le jeu ouvert au premier plan. Le podomètre est une estimation par capteur, distincte de la distance GPS.

Les énigmes et scores nécessitent une connexion. Le navigateur garde uniquement l'accès du capitaine sur son appareil. Sessions, membres, états d'énigme, scores, messages et traces GPS sont conservés en D1 ; photos en R2. Le partage global du Site demeure celui du calendrier, initialement privé.

## Développement

```sh
npm ci
npm run db:generate # seulement après modification du schéma
npm run check
npm run build
npm test
npm run test:ui
```

Le client React / TypeScript est assemblé par Vite. Le Worker sert le jeu et les routes `/api/reliquaire/`. Les migrations Drizzle sont livrées dans `dist/.openai/drizzle`. La déclaration `.openai/hosting.json` décrit les bindings DB / BUCKET, sans identifiant de Site. Pour un nouvel hébergement, enregistrer le projet et provisionner ces ressources ; le code source ne contient aucun identifiant ni jeton du Site de production.

Les tests d'intégration utilisent Miniflare avec D1 et R2 persistants, dans un dossier temporaire ignoré. Ils couvrent autorisation, indice, délai, passage, finale, reprise capitaine, GPS, messagerie, photos, bonus et redémarrage du Worker. Aucun test ne contacte ni ne modifie les données hébergées.

L'export maître de jeu contient scores, participants, messages, événements et positions. Les photos se téléchargent depuis la galerie. Les réponses correctes et indices non utilisés sont filtrés des réponses destinées aux joueurs.

## Hébergement et accès

Le multijoueur demande le serveur Worker, une base D1 (`DB`) et un bucket R2 (`BUCKET`). GitHub Pages peut servir des liens ou une interface statique, mais ne fournit pas ce serveur. Les actions du maître de jeu nécessitent l’en-tête utilisateur de confiance `oai-authenticated-user-id`, injecté par Sites ; il ne faut pas exposer cet en-tête comme un paramètre de connexion fourni par le navigateur.

Les migrations initiales ne créent que les tables `r_*` du jeu. Les tests Miniflare fonctionnent sans compte ni connexion à la production.
