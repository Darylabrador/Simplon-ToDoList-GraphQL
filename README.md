# Simplon-ToDoList-GraphQL

La conception et le développement de ce projet s'est effectué dans le cadre de la formation de Simplon.

J'utilise ici :

- FRONTEND : VueJS
- BACKEND : Laravel v8

Compte de test :

- Identifiant  : admin@gmail.com 
- Mot de passe : password


## Initialisation du projet

### Etape 1 : .env

Copier / coller le .env.example et renommer le en .env, ensuite modifier ou ajouter les lignes suivantes :

- DB_HOST=127.0.0.1
- DB_PORT=3306
- DB_DATABASE=grapql_laravel
- DB_USERNAME=root
- DB_PASSWORD=
- LIGHTHOUSE_CACHE_ENABLE=false

Pour les jobs :

- QUEUE_CONNECTION=database

Pour l'envoie de mail :

- MAIL_MAILER=smtp
- MAIL_HOST=smtp.mailtrap.io
- MAIL_PORT=2525
- MAIL_USERNAME=
- MAIL_PASSWORD=
- MAIL_ENCRYPTION=tls
- MAIL_FROM_ADDRESS=contact@zottodore.com
- MAIL_FROM_NAME="${APP_NAME}"

### Etape 2 : packages et jeux de données

Pour que le projet fonctionne correctement il faut avoir tous les packages nécessaires et le jeux de données, pour ce faire il faut utiliser les commandes suivantes :

- composer install
- php artisan migrate:fresh --seed
- php artisan passport:install --force
- npm install

## Lancement du projet 

En mode développement, il faut lancer le projet avec les commandes suivantes :

- php artisan serve
- php artisan queue:work
- npm run watch 

Si vous voulez accéder à un IDE pour voir comment réagit graphql, il vous suffit d'aller sur l'url suivant lorsque votre serveur est lancé :

- http://localhost:8000/graphql-playground

## Ressources 

- <a href="https://github.com/Darylabrador/Simplon-ToDoList-GraphQL/tree/ressources"> Ressource conception du projet </a>

- https://graphql.org/learn/
- https://laravel.sillo.org/graphql-et-laravel/
- https://www.toptal.com/graphql/laravel-graphql-server-tutorial
- https://lighthouse-php.com/tutorial/#what-is-graphql

## Ressources production :

- <a href="https://github.com/Darylabrador/Simplon-ToDoList-GraphQL/tree/production"> Code source de l'application déployer en mode production </a>