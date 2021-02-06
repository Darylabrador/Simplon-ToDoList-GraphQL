import Vue from 'vue';
import Vuetify from 'vuetify';
import Router from './router.js';
import Layout from './layouts/Layout.vue';
import FlashMessage from '@smartweb/vue-flash-message';
import 'vuetify/dist/vuetify.min.css';
import _ from 'lodash';

Vue.use(Vuetify);
Vue.use(FlashMessage);

const main = new Vue({
    el: '#app',
    vuetify: new Vuetify({}),
    router: Router,
    components: { Layout }
})

export default new Vuetify(main);