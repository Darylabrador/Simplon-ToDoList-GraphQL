# Simplon-ToDoList-GraphQL

La conception et le développement de ce projet s'est effectué dans le cadre de la formation de Simplon.

J'utilise ici :

- FRONTEND : VueJS
- BACKEND : NodeJS

Compte de test :

- Identifiant  : admin@gmail.com
- Mot de passe : password

## Initialisation du projet

### Server Etape 1  : .env

Copier / coller le .env.example et renommer le en .env, ensuite modifier les lignes suivantes avec les valeurs que vous aurez créer lors de l'initialisation de la BDD :

- DB_NAME=
- DB_USER=
- DB_PASSWORD=
- EMAIL_USER=
- API_KEY=
- JWT_SECRET=

Si vous être en mode production, veuillez remplir les informations ci-dessous : 

- PROD_DB_HOSTNAME=null
- PROD_DB_PORT=null

### Server Etape 2 : packages et jeux de données

Pour que le projet fonctionne correctement il faut avoir tous les packages nécessaires et le jeux de données, pour ce faire il faut utiliser les commandes suivantes :

- npm install
- sequelize db:migrate:undo:all
- sequelize db:migrate
- sequelize db:seed:all

ou

- npm install
- npm run dataInit

## Déploiement :

Pour le déploiement, il faut tout d'abord générer le fichier optimisé pour la production pour le dossier client via les commmandes :

- cd client
- npm run build

Vous aurez ensuite un dossier qui s'appel "dist". C'est celui-ci que vous aurez besoin.

Mettez le contenu de ce dossier à la racine de votre domaine / sous-domaine. Puis mettez en place votre backend NodeJS. 

note : Veuillez vérifier que les routes api soient correctes sinon refaite un 'npm run build'+ upload.

## Ressources :

- https://expressjs.com/fr/starter/generator.html
- https://graphql.org/graphql-js/
- https://sequelize.org/