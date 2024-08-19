<!-- SearchBook.vue -->
<template>
  <v-container>

    <div v-if="!isLoggedIn">
      <div style=" display: flex; flex-direction: column; gap: 48px; padding: 4px 0 18px 0;">
        <div class="txtBox">
          <div style="display: flex; gap: 8px; align-items: center;">
            <v-icon>mdi-magnify</v-icon>
            <h3>검색하기</h3>
          </div>
          <div class="title">
            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; gap: 6px;">
                <h1 style=" color: #a29cfe; letter-spacing: 0; font-size: 48px; line-height:60px;">Bookeep</h1>
                <h1 style="line-height: 60px;">과 함께 </h1>
              </div>
              <h1 style="line-height:60px;">당신을 기다리는 16만권의 새로운 세상</h1>
            </div>
            <div>
              <div class="subTitle">
                <h2>로그인 하고</h2>
                <!-- <div style="display: flex;">
                  <h2 class="brandName">Bookeep</h2>
                  <h2>과 함께 </h2>
                </div> -->
                <h2>독서의 새로운 세상을 탐험해보세요.</h2>
              </div>

            </div>
          </div>
        </div>
        <!-- <h2>로그인 하고 나의 독서 기록을 시작해보세요.</h2> -->
        <h3 style="padding: 0 8px;;">검색을 통해 어떤 도서가 있는지 확인해보세요</h3>
      </div>
    </div>

    <v-row no-gutters>
      <v-col cols=" 12">
        <v-text-field v-model="localQuery" @keyup.enter="searchBooks" @click:prepend-inner="searchBooks"
          @click:append-inner="searchBooks" prepend-inner-icon="mdi-magnify" append-inner-icon="mdi-arrow-right"
          class="searchField" filled rounded dense placeholder="책 이름을 입력하세요" />
      </v-col>
    </v-row>
    <v-row v-if="books.length > 0" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(460px,
          1fr));">
      <v-col v-for="(book, index) in books" :key="index" style="padding: 8px;">
        <v-card class="bookCard" @click="selectBook(book)" outlined flat>
          <v-card-text class="bookThumbnail">
            <v-img :src="book.thumbnail" />
          </v-card-text>
          <div
            style="width: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 8px 0;">
            <div>
              <p
                style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
                {{ book.title }}</p>
              <h3>{{ book.authors.length ? book.authors.join(", ") : "작가 정보 없음" }}</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; flex-direction: row; gap: 16px;">
                <h4 style="padding-right: 12px; box-shadow: 5px 0 0 -3px #c4c4c4;">발행연도 : {{
                  formatDate(book?.datetime) || '정보 없음' }}</h4>
                <h4>출판사 : {{ book?.publisher || '정보 없음' }}</h4>
              </div>
              <h4>ISBN: {{ book?.isbn }}</h4>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <h3 style="text-align: center; padding: 40px 0;">검색 결과가 없습니다.</h3>
      </v-col>
    </v-row>
    <BookDetailModal v-model="showModal" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { supabase } from '@/supabase';
import BookDetailModal from './BookDetailModal.vue';

const bookStore = useBookStore();
const localQuery = ref(bookStore.query);
const query = computed(() => bookStore.query);
const books = computed(() => bookStore.books);
const showModal = computed(() => bookStore.showModal);
const isLoggedIn = ref(false);

const searchBooks = () => {
  console.log('searchBooks 호출');
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

const keywords = ['푸바오', '인문학', '신춘문예', '우주', '트렌드'];

const getRandomKeyword = () => {
  const randomIndex = Math.floor(Math.random() * keywords.length);
  return keywords[randomIndex];
};

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  isLoggedIn.value = !!data.session;
  console.log('isLoggedIn:', isLoggedIn.value);

  if (!isLoggedIn.value) {
    localQuery.value = getRandomKeyword();
    console.log('localQuery 설정:', localQuery.value);
    searchBooks();
  }
});
</script>

<style scoped>
.brandName {
  color: #A29CFE;
  font-size: 34px;
  font-weight: 600;
  letter-spacing: 0;
}
.bookCard {
  display: flex;
  /* margin: 8px; */
  /* margin-bottom: 36px; */
  overflow: visible;
  gap: 24px;
  padding: 20px;
  /* background-color: #f7f7f7; */
  border: 1px solid #dcdce5;
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
.txtBox {
  padding: 0 0.5%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.title {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.subTitle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

:deep(.v-field__outline) {
  display: none;
}
</style>