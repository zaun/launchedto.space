import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vueperslides/dist/vueperslides.min.css';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vuetify);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
