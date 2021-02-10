import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from './connexion/Login.vue';
import Register from './connexion/Register.vue';
import Dashboard from './views/Dashboard.vue';

Vue.use(VueRouter);

const router = new VueRouter({
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
            path: '/connexion',
            name: 'login',
            component: Login
        },
    ]
});

router.beforeEach((to, from, next) => {
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

export default router;