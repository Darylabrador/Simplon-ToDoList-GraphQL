import Axios from 'axios';

export default {
    data() {
        return {
            loginPath: "/connexion",
            message: ''
        }
    },

    
    created() {
        if (localStorage.getItem('zotToken')) {
            return this.$router.push('/dashboard')
        }
        if (!this.$route.params.token) {
            this.$router.push('/connexion')
        } else {
            this.verify(this.$route.params.token);
        }
    },

    methods: {
        async verify(verifyToken) {
            try {
                const graphqlQuery = {
                    query: `
                    mutation{
                        verifyMail( confirmToken: "${verifyToken}" )
                        }
                    `,
                };
                const verifyRequest = await Axios.post(`${location.origin}/graphql`, graphqlQuery);
                const verifyErrors = verifyRequest.data.errors;

                if (verifyErrors) {
                    this.message = verifyErrors[0].message;
                } else {
                    const verifyData = verifyRequest.data.data.verifyMail;
                    this.message = verifyData;
                }
            } catch (error) {
                this.flashMessage.error({
                    title: "Impossible d'effectuer cette action",
                    time: 8000,
                });
            }
        }
    }
}