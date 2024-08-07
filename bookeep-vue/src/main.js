// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import router from './router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import './assets/main.css';

const vuetify = createVuetify({
    components,
    directives,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount('#app');
