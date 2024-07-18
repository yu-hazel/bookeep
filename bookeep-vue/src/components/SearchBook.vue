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
      <v-col v-for="(book, index) in books" :key="index" style="padding: 8px; max-width: 487px;">
        <v-card class="bookCard" @click="selectBook(book)" outlined flat>
          <v-card-text class="bookThumbnail">
            <v-img :src="book.thumbnail" />
          </v-card-text>
          <div
            style="min-width:180px; width: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 8px 0;">
            <div>
              <p>{{ book.title }}</p>
              <h3>{{ book.authors.length ? book.authors.join(", ") : "작가 정보 없음" }}</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; flex-direction: row; gap: 16px;">
                <h4 style="padding-right: 12px; box-shadow: 5px 0 0 -3px #999;">발행연도 : {{
                  formatDate(book?.datetime) || '정보 없음' }}</h4>
                <h4>출판사 : {{ book?.publisher || '정보 없음' }}</h4>
              </div>
              <h4>ISBN: {{ book?.isbn }}</h4>
            </div>
          </div>
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

const formatDate = (datetime) => {
  if (!datetime) return '';
  return datetime.split('-')[0];
};
</script>

<style scoped>
.bookCard {
  display: flex;
  /* margin: 8px; */
  /* margin-bottom: 36px; */
  overflow: visible;
  gap: 24px;
  padding: 20px;
  /* background-color: #f7f7f7; */
  border: 1px solid #eeeeee;
  border-radius: 12px;
}

.bookThumbnail {
  width: 120px;
  height: 174px;
  flex: none;
  padding: 0;
  object-fit: cover;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-field__outline) {
  display: none;
}
</style>