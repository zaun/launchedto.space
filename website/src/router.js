import Vue from 'vue';
import Router from 'vue-router';
import Launches from './views/Launches.vue';
import Rockets from './views/Rockets.vue';

Vue.use(Router);

export default new Router({
  scrollBehavior: (to) => {
    if (to.hash) {
      return {
        selector: to.hash,
        offset: { x: 0, y: 60 },
      };
    }
    return { x: 0, y: 0 };
  },

  routes: [{
    path: '/launches',
    name: 'launches',
    component: Launches,
  }, {
    path: '/launches/:id',
    name: 'launch',
    component: Launches,
  }, {
    path: '/rockets',
    name: 'rockets',
    component: Rockets,
  }, {
    path: '/',
    redirect: '/launches',
  }],
});
