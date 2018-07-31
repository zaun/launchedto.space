import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';

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
    path: '/',
    name: 'home',
    component: Home,
  }, {
    path: '/about',
    name: 'about',
    component: About,
  }],
});
