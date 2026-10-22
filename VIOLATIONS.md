# Problèmes de conception relevés

Les numéros de ligne renvoient à `ReportService.js`.

## 1. Responsabilité unique (S) — lignes 20–23 et 25–87

**Problème.** `ReportService` lit les commandes, calcule les totaux, met en forme plusieurs exports, journalise et prépare l'envoi d'e-mails.

**Conséquences.** Si une règle de TVA ou le stockage change, il faut modifier cette même classe, au risque de casser l'export ou l'envoi. Les tests doivent en outre configurer ou observer plusieurs responsabilités à la fois.

## 2. Ouvert/fermé (O) — lignes 47–70

**Problème.** Les formats sont sélectionnés par une chaîne de `if/else` dans `generate`.

**Conséquences.** Ajouter un format oblige à modifier `generate` et son bloc de contrôle. Une erreur dans cette modification peut affecter les formats existants, qu'il faudra alors retester.

## 3. Substitution de Liskov (L) — lignes 92–96

**Problème.** `FreeReportService` accepte moins de cas que `ReportService` : elle rejette le HTML, le JSON et tout destinataire, alors que la classe parente les accepte.

**Conséquences.** Du code qui utilise une instance gratuite à la place d'un `ReportService` peut échouer à l'exécution sur des appels pourtant valides avec le parent.

## 4. Inversion des dépendances (D) — lignes 4, 7–17, 20–22 et 73–85

**Problème.** Le service construit lui-même ses dépendances concrètes et utilise directement le système de fichiers, la console, l'horloge et une configuration SMTP.

**Conséquences.** En test, il est difficile de remplacer ces éléments par des doublures : les tests dépendent de fichiers et de sorties globales. Changer de stockage ou de transport e-mail impose de modifier le service.

## 5. Entrées non échappées — lignes 54–56

**Problème.** Les valeurs dynamiques (mois et catégories) sont insérées directement dans le HTML, sans échappement.

**Conséquences.** Si ces valeurs contiennent du balisage, le rapport rendu peut être altéré. Un test avec des caractères spéciaux ne garantit pas un HTML sûr tant que l'échappement n'est pas prévu.

## 6. Effets de bord mêlés au calcul — lignes 72–85

**Problème.** `generate` écrit dans la console, modifie l'historique et ajoute un e-mail à chaque appel, en plus de produire le rapport.

**Conséquences.** Un appel répété pour simplement régénérer le même rapport produit plusieurs entrées d'historique et plusieurs envois simulés. Les tests doivent aussi vérifier ces effets de bord au lieu de se limiter au résultat.