import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import routes from 'virtual:generated-pages';
import Home from '../pages/Home.vue';

const router = createRouter({
  history: createWebHistory('bookeep'),
  routes : [
    { path: '/', component: Home },
    ...routes,
  ]
});

export default router
