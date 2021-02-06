<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Modification mot de passe</title>
</head>
<body>
        <p> 
            Bonjour {{ $pseudo }}, <br>
            Votre mot de passe a été modifier le {{ $datenow }} depuis l'adresse IP {{ $adresseIP }}<br>
        </p>
        
        <p> 
        Cordialement, <br>
        L'équipe de ZotTodoRe 
    </p>
</body>
</html>