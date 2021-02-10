import Axios from 'axios';

export default {
    data: () => ({
        valid: false,
        pseudo: '',
        email: '',
        password: '',
        passwordConfirm: '',
        pseudoRules: [
            v => !!v || 'Mot de passe requis',
        ],
        emailRules: [
            v => !!v || 'Adresse e-mail requise',
            v => /.+@.+\..+/.test(v) || 'Adresse e-mail est invalide',
        ],
        passwordRules: [
            v => !!v || 'Mot de passe requis',
        ], 
        passwordConfirmRules: [
            v => !!v || 'Mot de passe requis',
        ],
        loginPath: "/connexion"
    }),


    created() {
        if (localStorage.getItem('zotToken')) {
            return this.$router.push('/dashboard')
        }
    },

    methods: {
        async validate() {
            try {
                this.$refs.form.validate()
                if (this.valid) {
                    const graphqlQuery = {
                        query: `
                            mutation{
                                createUser(
                                    pseudo: "${this.pseudo}" 
                                    email: "${this.email}" 
                                    password: "${this.password}"
                                    passwordConfirm: "${this.passwordConfirm}"
                                )
                            }
                        `,
                    };
                    const registerRequest = await Axios.post(`${location.origin}/graphql`, graphqlQuery);
                    const registerData = registerRequest.data.data.createUser;
                    if (registerData == null) {
                        this.flashMessage.error({
                            title: "Les mots de passe ne sont pas identique",
                            time: 8000,
                        })
                    } else {
                        this.pseudo   = "";
                        this.email    = "";
                        this.password = "";
                        this.password = "";
                        this.$router.push(this.loginPath)
                        this.flashMessage.success({
                            title: "Vous pouvez vous connecter",
                            time: 8000,
                        })
                    }
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        },
    },
}
