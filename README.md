# Simplon-ToDoList-GraphQL

La conception et le développement de ce projet s'est effectué dans le cadre de la formation de Simplon.

J'utilise ici :

- FRONTEND : VueJS
- BACKEND : Laravel v8

Compte de test :

- Identifiant  : j.doe@gmail.com  
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

## Ressources 

- https://laravel.sillo.org/graphql-et-laravel/
- https://lighthouse-php.com/tutorial/#what-is-graphql