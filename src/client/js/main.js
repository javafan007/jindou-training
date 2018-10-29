import 'element-ui/lib/theme-chalk/index.css';
import '../css/style.css'

import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router/index';
import axios from 'axios';


Vue.use(ElementUI);
Vue.use(require('vue-moment'));

const app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
});


//异常拦截器
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if(error.response.status === 401) {
        router.push({ path: '/login' });
    } else {
        app.$message.error('服务器端异常');
    }
    return Promise.reject(error);
});

