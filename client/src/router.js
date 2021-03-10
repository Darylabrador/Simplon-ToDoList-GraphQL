import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from './connexion/Login.vue';
import Register from './connexion/Register.vue';
import Dashboard from './views/Dashboard.vue';
import ResetPassword from './connexion/ResetPassword.vue';
import VerifyEmail from './connexion/VerifyEmail.vue';

Vue.use(VueRouter);

const Router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: { requiresAuth: true }
        },
        {
            path: '/inscription',
            name: 'register',
            component: Register
        },
        {
            path: '/',
            name: 'accueil',
            component: Login
        },
        {
            path: '/connexion',
            name: 'login',
            component: Login
        },
        {
            path: '/reset',
            name: 'reset',
            component: ResetPassword
        },
        {
            path: '/reset/:token',
            name: 'resettoken',
            component: ResetPassword
        },
        {
            path: '/email/verification/:token',
            name: 'verifymail',
            component: VerifyEmail
        },
    ]
});

Router.beforeEach((to, from, next) => {
    function isLogged() {
        return localStorage.getItem('zotToken');
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLogged()){
            return next({ path: "/connexion" });
        }
    }
    return next();
});

export default Router;