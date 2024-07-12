<!-- src/App.vue -->
<template>
  <v-app>
    <NavBar />
    <v-main class="d-flex" style="justify-content: center; ">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
  },
};
</script>