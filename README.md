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

- JWT_SECRET=
- API_KEY=null
- DB_USER=null
- DB_PASSWORD=null
- DB_NAME=null

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