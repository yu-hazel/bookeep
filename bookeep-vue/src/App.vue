<!-- src/App.vue -->
<template>
  <v-app>
    <v-container>
      <SearchBook />
      <BookTabs />
    </v-container>
  </v-app>
</template>

<script setup>
import SearchBook from './components/SearchBook.vue';
import BookTabs from './components/BookTabs.vue';
</script>

<!-- <script>
import SearchBook from './components/SearchBook.vue';
import BookTabs from './components/BookTabs.vue';

export default {
  name: 'App',
  components: {
    SearchBook,
    BookTabs,
  }
};
</script> -->