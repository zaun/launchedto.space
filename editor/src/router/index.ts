import { provide, inject, reactive } from '@vue/composition-api';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/rockets/:fam?/:id?',
    name: 'rockets',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rockets" */ '../views/Rockets.vue'),
  },
  {
    path: '/launches/:id?',
    name: 'launches',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "launches" */ '../views/Launches.vue'),
  },
  {
    path: '/astronauts/:id?',
    name: 'astronauts',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "astronauts" */ '../views/Astronauts.vue'),
  },
];

const vueRouter = new VueRouter({
  routes,
});


const RouterSymbol = Symbol('Application Router');

export function provideRouter() {
  provide(RouterSymbol, reactive(vueRouter));
}

export function useRouter() {
  const router = inject(RouterSymbol);
  if (!router) {
    // throw error, no store provided
  }
  return router as VueRouter;
}

export default vueRouter;
