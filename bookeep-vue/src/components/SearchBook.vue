<!-- SearchBook.vue -->
<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field v-model="localQuery" label="책 이름을 입력하세요" @keyup.enter="searchBooks"
          @click:prepend-inner="searchBooks" @click:append-inner="searchBooks" prepend-inner-icon="mdi-magnify"
          append-inner-icon="mdi-arrow-right" class="searchField" filled rounded dense />
      </v-col>
    </v-row>
    <v-row v-if="books.length">
      <v-col xs="6" sm="4" md="4" lg="3" xl="2" v-for="(book, index) in books" :key="index">
        <v-card class="bookCard" @click="selectBook(book)" outlined flat>
          <v-card-text>
            <v-img :src="book.thumbnail" class="bookThumbnail" />
          </v-card-text>
          <v-card-subtitle>
            <h4>{{ book.authors.length ? book.authors.join(", ") : "작가 정보 없음" }}</h4>
          </v-card-subtitle>
          <v-card-title class="bookTitle">
            <h5>{{ book.title }}</h5>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <BookDetailModal v-model="showModal" />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import BookDetailModal from './BookDetailModal.vue';

const bookStore = useBookStore();
const localQuery = ref(bookStore.query);
const query = computed(() => bookStore.query);
const books = computed(() => bookStore.books);
const showModal = computed(() => bookStore.showModal);

const searchBooks = () => {
  bookStore.setQuery(localQuery.value);
  bookStore.searchBooks();
};

const selectBook = (book) => {
  bookStore.selectBook(book);
};
</script>

<style scoped>
.bookCard {
  margin: 8px;
}

.bookThumbnail {
  object-fit: cover;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.bookTitle {
  font-size: 16px;
  padding-top: 0;
}

:deep(.v-field__outline) {
  display: none;
}

@media (max-width: 600px) {
  .v-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>