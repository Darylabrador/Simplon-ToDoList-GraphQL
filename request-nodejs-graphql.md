## Création d'un compte utilisateur

mutation{
  createUser(userInput: {
    pseudo: "", 
    email: "", 
    password: "",
    passwordConfirm: ""
  })
}
