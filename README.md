# MusicStream 🎶

"MusicStream" est une application musicale simple basée sur Angular, offrant une expérience basique aux utilisateurs pour écouter et organiser leur musique locale. Pour assurer une gestion efficace des états du lecteur et des tracks, nous adoptons NgRx comme solution de gestion d'état centralisée.

## Contexte du projet

L'objectif principal est de créer une application musicale simple et fonctionnelle avec NgRx, offrant une expérience utilisateur fluide et une architecture maintenable, tout en assurant une gestion efficace des fichiers audio locaux.

## Gestion des tracks 📜

Système CRUD complet avec NgRx incluant pour chaque track :
- **Nom de la chanson**
- **Nom du chanteur**
- **Description optionnelle** (max 200 caractères)
- **Date d'ajout** (automatique)
- **Durée de la chanson** (calculée automatiquement)
- **Catégorie musicale** (pop, rock, rap, cha3bi, etc.)

## Lecteur audio 🎧

Développer les contrôles essentiels :
- **Play, Pause, Next, Previous**
- **Contrôle du volume et de la progression**
- Utiliser **Web Audio API** ou équivalent pertinent

## Pages principales requises 📄

- **Page Bibliothèque** : Liste complète des tracks créés avec la barre de recherche
- **Page Track** : Affichage détaillé et lecture du track sélectionné
- Autres pages optionnelles selon votre vision du projet

## Tâches Principales 🛠️

### Configuration initiale
- Mettre en place la structure de base Angular avec architecture modulaire
- Structurer les composants principaux selon les bonnes pratiques
- Configurer le routing avec lazy loading

### Configuration de NgRx
- Implémenter les modules NgRx (actions, réducteurs, effets, sélecteurs)
- Implémentation d'un système de gestion d'état du lecteur :
  - **États de base** : 'playing', 'paused', 'buffering', 'stopped'
  - **États de chargement** : 'loading', 'error', 'success'
  - Mise en place d'effects pour la gestion asynchrone des erreurs
  - Messages d'erreur UI correspondants aux différents états

### Gestion des fichiers audio
- Stockage dans **IndexedDB** avec deux tables :
  - Une table pour les fichiers audio (blobs)
  - Une table pour les métadonnées (informations sur les tracks)
- Limiter la taille des fichiers à **15MB maximum**
- Supporter les formats **MP3, WAV et OGG**

### Validations
- Limites de caractères (titre: 50, description: 200)
- Validation des formats de fichiers (audio et images)
- Gestion des erreurs de upload/stockage
- Autres validations pertinentes

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
