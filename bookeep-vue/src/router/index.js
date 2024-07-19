import { createRouter, createWebHistory } from 'vue-router';
import routes from 'virtual:generated-pages'; // auto router
import { supabase } from '@/supabase';

const router = createRouter({
  history: createWebHistory('bookeep'),
  routes: [
    { path: '/', component: () => import('@/pages/Home.vue') },
    { path: '/before-login', component: () => import('@/pages/BeforeLogin.vue') },
    { path: '/search-books', component: () => import('@/pages/SearchBooks.vue') },
    ...routes,
  ],
});

// 로그인 전에는 무조건 검색 페이지로 이동
router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (!session && to.path === '/') {
    next('/search-books');
  } else if (!session && to.path !== '/before-login' && to.path !== '/search-books') {
    next('/search-books');
  } else {
    next();
  }
});

export default router;