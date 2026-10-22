# TP3 — Rapports de ventes et principes SOLID

Cette application génère un rapport mensuel à partir de commandes JSON. Elle sépare le calcul des statistiques métier, le formatage et les services techniques afin de faciliter les évolutions et les tests.

## Organisation

- `domain/` : calcul des statistiques et règles métier.
- `application/` : orchestration de la génération du rapport avec des dépendances injectées.
- `formatters/` : formateurs CSV, HTML, JSON et Markdown, ainsi que leur registre.
- `infrastructure/` : dépôt JSON, journaliseur console et mailer simulé.
- `orders.json` : données utilisées par la démonstration et les tests.
- `VIOLATIONS.md` : problèmes de conception relevés dans le code de départ.

## Exécuter la démonstration

Depuis la racine du dépôt :

```sh
node tp3-Lionel_DEGBE-Steve_Jiokeng_Woteu/demo.js
```

La démonstration génère un rapport CSV et un rapport HTML pour septembre 2026 et affiche le nombre d'e-mails simulés.

## Lancer les tests

Depuis la racine du dépôt :

```sh
node --test tp3-Lionel_DEGBE-Steve_Jiokeng_Woteu/ReportService.caracterisation.test.js
```

Le test Markdown enregistre un formateur supplémentaire dans `FormatterRegistry`, puis vérifie le résultat sans modifier `application/ReportService.js`.
