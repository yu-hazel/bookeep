import { createRouter, createWebHistory } from 'vue-router';
import routes from 'virtual:generated-pages'; // auto router
import { supabase } from '@/supabase';

const router = createRouter({
  history: createWebHistory('bookeep'),
  routes: [
    { path: '/', component: () => import('@/pages/Home.vue') },
    { path: '/before-login', component: () => import('@/pages/BeforeLogin.vue') },
    ...routes,
  ],
});

// router.beforeEach(async (to, from, next) => {
//   const { data } = await supabase.auth.getSession();
//   const session = data.session;

//   if (!session && to.path !== '/before-login') {
//     next('/before-login');
//   } else {
//     next();
//   }
// });

export default router;