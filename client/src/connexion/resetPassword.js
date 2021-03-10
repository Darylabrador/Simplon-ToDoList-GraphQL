import Axios from 'axios';

export default {
    data: () => ({
        valid: false,
        isValid: false,
        resetToken: '',
        isTokenExist: false,
        email: '',
        password: '',
        passwordConfirm: '',
        emailRules: [
            v => !!v || 'Adresse e-mail requise',
            v => /.+@.+\..+/.test(v) || 'Adresse e-mail est invalide',
        ],
        passwordRules: [
            v => !!v || 'Nouveau mot de passe requis',
            v => v.length > 5 || '6 caractères minimuns',
        ],
        passwordConfirmRules: [
            v => !!v || 'Confirmation mot de passe requis',
            v => v.length > 5 || '6 caractères minimuns',
        ],
        loginPath: "/connexion"
    }),

    watch: {
        password(val) {
            if (val != '') {
                this.isValidFields(val, this.passwordConfirm)
            } else {
                this.isValid = false;
            }
        },
        passwordConfirm(val) {
            if (val != '') {
                this.isValidFields(this.password, val)
            } else {
                this.isValid = false;
            }
        },
    },

    created() {
        if (localStorage.getItem('zotToken')) {
            return this.$router.push('/dashboard')
        }
        if (this.$route.params.token){
            this.resetToken = this.$route.params.token;
            this.isTokenExist = true;
        } else {
            this.resetToken =  this.$route.params.token;
            this.isTokenExist = false;
        }
    },

    methods: {
        async sendEmail() {
            try {
                this.$refs.form.validate()
                if (this.valid) {
                    const graphqlQuery = {
                        query: `
                            mutation{
                                sendForgottenMail( email: "${this.email}" )
                                }
                        `,
                    };
                    // const sendMailRequest = await Axios.post(`${location.origin}/graphql`, graphqlQuery);
                    const sendMailRequest = await Axios.post(`http://localhost:3000/graphql`, graphqlQuery);
                    const sendMailErrors = sendMailRequest.data.errors;

                    if (sendMailErrors) {
                        this.flashMessage.error({
                            title: sendMailErrors[0].message,
                            time: 8000,
                        })
                    } else {
                        const sendMailData = sendMailRequest.data.data.sendForgottenMail;
                        this.flashMessage.success({
                            title: sendMailData,
                            time: 8000,
                        });
                    }
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                });
            }
        },
        async validate() {
            try {
                this.$refs.form.validate()
                if (this.valid) {
                    const graphqlQuery = {
                        query: `
                            mutation{
                                resetForgotten(
                                    newPassword: "${this.password}" 
                                    newPasswordConfirm: "${this.passwordConfirm}"
                                    resetToken: "${this.resetToken}"
                                    )
                                }
                        `,
                    };
                   
                    // const resetRequest = await Axios.post(`${location.origin}/graphql`, graphqlQuery);
                    const resetRequest = await Axios.post(`http://localhost:3000/graphql`, graphqlQuery);
                    const resetErrors = resetRequest.data.errors;

                    if (resetErrors) {
                        this.flashMessage.error({
                            title: resetErrors[0].message,
                            time: 8000,
                        })
                    } else {
                        const resetData = resetRequest.data.data.resetForgotten;
                        this.isValid = false;
                        this.resetToken = '';
                        this.isTokenExist = false;
                        this.password = '';
                        this.passwordConfirm = '';
                        this.flashMessage.success({
                            title: resetData,
                            time: 8000,
                        });
                        this.$router.push("/connexion");
                    }
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Ressource indisponible",
                    time: 8000,
                })
            }
        },
        isValidFields(password, passwordConfirm) {
            if (password.length > 5 && passwordConfirm.length > 5) {
                this.isValid = true;
            } else {
                this.isValid = false;
            }
        }
    },
}
