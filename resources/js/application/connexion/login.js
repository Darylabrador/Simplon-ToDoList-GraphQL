import Axios from 'axios';

export default {
    data: () => ({
        valid: false,
        password: '',
        passwordRules: [
            v => !!v || 'Mot de passe requis',
        ],
        email: '',
        emailRules: [
            v => !!v || 'Adresse e-mail requise',
            v => /.+@.+\..+/.test(v) || 'Adresse e-mail est invalide',
        ],
        registerPath: "/inscription",
        forgottenPath: "/reset"
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
                if(this.valid) {
                    const graphqlQuery = {
                        query: `
                            mutation{
                                login(
                                    email: "${this.email}" 
                                    password: "${this.password}"
                                    )
                                }
                        `,
                    };
                    const loginRequest = await Axios.post(`${location.origin}/graphql`, graphqlQuery);
                    const loginData = loginRequest.data.data.login;
                 
                    if (loginData[0] == "0") {
                        this.flashMessage.error({
                            title: loginData[1],
                            time: 8000,
                        })
                    }

                    if (loginData[0] == "1") {
                        localStorage.setItem('zotToken', loginData[1]);
                        this.email = "";
                        this.password = "";
                        this.$emit('updateNavbar', true);
                        this.$router.push('/dashboard');
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
