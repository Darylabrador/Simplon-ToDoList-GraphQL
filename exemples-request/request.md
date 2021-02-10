## Request exemple :

### Connexion : 

mutation{login(email: "admin@gmail.com" password: "password")}

### Deconnexion :

mutation{logout}

### Inscription :

mutation{createUser(pseudo: "jh974" email: "jh974@gmail.com" password: "password")}

### mot de passe oublié 


### Mise à jour mot de passe :

mutation{
  updatePassword(
    password: "password974" 
  )
}

### Toutes les tâches d'un utilisateur connecté :

{tasks{id title description done priority{id label} user{id pseudo}}}

### Toutes les tâches filtré par priorité :

{
tasks(where: { column: PRIORITY_ID, operator: EQ, value: 1 }) {
    id title description done priority{id label} user{id pseudo}
  }
}

### Créer une todo

mutation{
  createTask(
  	title: "test" 
  	description: "test" 
  	deadline:"2021-02-04 20:31:30"
    priority_id: 1
  )
  {id title description done priority{id label} user{id pseudo}}
}


### Mise à jour info d'une todo

mutation{
  updateTask(
    id: 2 
    title: "tache 2 test" 
    description:"badasss description"
    deadline: "2021-02-24 17:11:30"
    priority_id: 3
  )
  {id title description done priority{id label} user{id pseudo}}
}

### Noté une todo comme exécutée

mutation{
  setEndTask(id: 2 done: false)
  {id title description done priority{id label} user{id pseudo}}
}

### Supprimer une todo (softdelete)

mutation{
  deleteTask(
    id: 2 
  )
  {id title description done priority{id label} user{id pseudo}}
}