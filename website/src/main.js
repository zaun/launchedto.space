import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueAnalytics from 'vue-analytics';
import VueYoutube from 'vue-youtube';

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vueperslides/dist/vueperslides.min.css';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueAnalytics, {
  id: 'UA-123671572-1',
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production',
  },
  router,
});

Vue.use(Vuetify);
Vue.use(VueYoutube);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
