import 'element-ui/lib/theme-chalk/index.css';
import '../css/style.css'

import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router/index';

Vue.use(ElementUI);

const app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
});

