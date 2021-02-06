import token from '../services/token.js';

export default {
    data() {
        return {
            isLogged: token.isTokenStored()
        }
    },
    methods: {
        deconnexion() {
            localStorage.clear();
            location.href = '/login';
        }
    }
}