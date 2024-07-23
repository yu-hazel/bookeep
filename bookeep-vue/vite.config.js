import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bookeep/',
  plugins: [
    vue(),
    Pages({
      dirs: 'src/pages',
      extensions: ['vue'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server: {
  //   proxy: {
  //     '/supabase': {
  //       target: 'https://vovzpunshmcodmkletaw.supabase.co',
  //       // 리포지토리 주소로 변경하고 빌드하기
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/supabase/, ''),
  //       secure: false,
  //     },
  //   },
  // },
});