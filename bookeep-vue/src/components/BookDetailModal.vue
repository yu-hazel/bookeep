<template>
  <v-dialog v-model="showModal" max-width="500">
    <v-card>
      <v-card-title>
        <v-spacer>
          <v-icon style="color: #A29cfe;">mdi-check</v-icon> 새로운 기록
        </v-spacer>
        <v-icon @click="closeModal" size="x-small">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="bookDetailWrapper" style="padding: 97px 50px;">
        <v-img :src="selectedBook?.thumbnail" class="bookDetailImage"></v-img>
        <div>
          <h1>{{ selectedBook?.title }}</h1>
          <div class="bookSubData">
            <h5>{{ selectedBook?.authors?.join(", ") || '작가 정보 없음' }}</h5>
            <h5><span>ISBN:</span> {{ selectedBook?.isbn }}</h5>
            <div v-if="selectedCategory === '다 읽은 책'" class="rating">
              <span>나의 평점:</span>
              <v-rating v-model="rating" background-color="purple" color="deep-purple-lighten-3" density="compact"
                length="5" half-increments clearable></v-rating>
            </div>
          </div>
          <div v-if="editedBookCategory === '다 읽은 책'">
            <h4>독서 종료일</h4>
            <v-text-field v-if="selectedCategory === '다 읽은 책'" v-model="endDate" type="date" dense class="mt-4"
              id="modalEndDate"></v-text-field>
          </div>
          <v-text-field v-model="pages" label="페이지 수" dense class="mt-4" id="modalPages"></v-text-field>
          <v-text-field v-if="selectedCategory === '읽는 중인 책'" v-model="readingPage" label="읽는 중인 페이지" dense class="mt-4"
            id="modalReadingPage"></v-text-field>
          <v-text-field v-if="selectedCategory !== '읽고 싶은 책'" v-model="startDate" label="독서 시작일" type="date" dense
            class="mt-4" id="modalStartDate"></v-text-field>

          <div class="commentBox">
            <v-text-field v-model="comment" label="코멘트" dense class="mt-4" id="modalComment"></v-text-field>
          </div>
          <div class="category-buttons mt-4">
            <v-btn v-for="category in categories" :key="category" @click="selectedCategory = category"
              :color="selectedCategory === category ? 'primary' : ''">
              {{ category }}
            </v-btn>
          </div>
          <div class="bottomBt"><v-btn color="primary" @click="saveBook" class="mt-4 saveBt">저장</v-btn></div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore';

const bookStore = useBookStore();
const selectedBook = computed(() => bookStore.selectedBook);
const showModal = computed({
  get: () => bookStore.showModal,
  set: (value) => {
    if (!value) {
      bookStore.closeModal();
    }
  },
});

const categories = computed(() => bookStore.categories);
const createComputedSetter = (key) => {
  return computed({
    get: () => bookStore[key],
    set: (value) => {
      bookStore[key] = value;
    }
  });
};

const pages = createComputedSetter('pages');
const comment = createComputedSetter('comment');
const selectedCategory = createComputedSetter('selectedCategory');

const startDate = ref('');
const endDate = ref('');
const rating = ref(0);
const readingPage = ref('');

watch(() => bookStore.selectedBook, (newBook) => {
  if (newBook) {
    startDate.value = bookStore.startDate;
    endDate.value = bookStore.endDate;
    readingPage.value = bookStore.readingPage || '';
    rating.value = bookStore.rating || 0;
  } else {
    startDate.value = '';
    endDate.value = '';
    readingPage.value = '';
    rating.value = 0;
  }
});

const closeModal = bookStore.closeModal;

const saveBook = () => {
  bookStore.pages = pages.value;
  bookStore.comment = comment.value;
  bookStore.selectedCategory = selectedCategory.value;
  bookStore.startDate = startDate.value;
  bookStore.endDate = endDate.value;
  bookStore.readingPage = readingPage.value;
  bookStore.rating = rating.value;
  bookStore.saveBook();
};
</script>

<style scoped>
.v-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bookDetailWrapper {
  display: flex;
}

.bookDetailImage {
  height: 200px;
  margin-bottom: 16px;
}

.category-buttons {
  display: flex;
  gap: 10px;
}
</style>