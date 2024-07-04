// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
});

// const router = createRouter({
//     history: createWebHistory(),
//     routes: [
//         // 라우터 추가
//     ],
// });

const app = createApp(App);

app.use(createPinia());
// app.use(router);
app.use(vuetify);
app.mount('#app');
