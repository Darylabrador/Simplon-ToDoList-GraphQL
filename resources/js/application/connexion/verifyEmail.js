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
                const verifyData = verifyRequest.data.data.verifyMail;

                if (verifyData[0] == "0") {
                    this.message = verifyData[1];
                }

                if (verifyData[0] == "1") {
                    this.message = verifyData[1];
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