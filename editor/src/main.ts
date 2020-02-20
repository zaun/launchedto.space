import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import './plugins/composition-api';
import './plugins/sticky';
import store from './store';

Vue.config.productionTip = false;

store.init();

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
