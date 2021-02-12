import { apiService } from '../_services/apiService.js';
import ChangePassword from '../components/modals/ChangePassword.vue';

export default {
    components: {
        ChangePassword
    },
    data() {
        return {
            connected: localStorage.getItem('zotToken') != null ? true : false,
            registerPath: '/inscription',
            loginPath: '/connexion'
        }
    },

    methods: {
        async deconnexion() {
            try {
                const graphqlQuery = {
                    query: `mutation{logout}`,
                };
                const loggoutRequest = await apiService.post(`${location.origin}/graphql`, graphqlQuery);
                const loggoutData = loggoutRequest.data.data.logout;
                if (loggoutData) {
                    this.connected = false;
                    localStorage.clear();
                    this.$router.push('/connexion')
                }
            } catch (error) {
                this.connected = false;
                localStorage.clear();
                this.$router.push('/connexion')
            }
        },
        updateNavbar(isLogged){
            this.connected = isLogged;
        }
    }
}