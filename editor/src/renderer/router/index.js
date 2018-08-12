import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/astronauts',
      name: 'astronauts',
      component: require('@/components/Astronauts').default,
    },
    {
      path: '/launches',
      name: 'launches',
      component: require('@/components/Launches').default,
    },
    {
      path: '/rockets',
      name: 'rockets',
      component: require('@/components/Rockets').default,
    },
    {
      path: '*',
      redirect: '/launches',
    },
  ],
});
