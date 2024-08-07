<template>
  <v-dialog v-model="showModal" max-width="500" max-height="850">
    <v-card style="border-radius: 30px; box-shadow: 0 4px 25px #767676; height: 100%;">
      <v-card-title>
        <v-spacer class="bookCategory">
          <v-icon style="color: #A29cfe;">mdi-check</v-icon>
          <h3>새로운 책</h3>
        </v-spacer>
        <v-icon @click="closeModal" size="x-small" style="position: absolute; right: 30px; top: 30px;">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="bookDetailWrapper">
        <div class="DataBox" style="display: flex; gap: 32px; flex-direction: row;">
          <div style="display: flex; align-items: center;">
            <v-img :src="selectedBook?.thumbnail" class="bookDetailImage"></v-img>
          </div>
          <div class="bookData">
            <div style="display: flex; flex-direction: column; gap:4px;">
              <h1>{{ selectedBook?.title }}</h1>
              <h3>작가 : {{ selectedBook?.authors?.join(", ") || '작가 정보 없음' }}</h3>
            </div>
            <div class="bookSubData">

              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                <div style="display: flex; flex-direction: row; gap: 16px;">
                  <h4 style="padding-right: 12px; box-shadow: 5px 0 0 -3px #999;">발행연도 : {{
                    formatDate(selectedBook?.datetime) || '정보 없음' }}</h4>
                  <h4>출판사 : {{ selectedBook?.publisher || '정보 없음' }}</h4>
                </div>
                <h4>ISBN: {{ selectedBook?.isbn }}</h4>
              </div>
            </div>
          </div>
        </div>
        <div class="bookDetailTxt">
          <div class="category-buttons mt-4">
            <v-btn v-for="category in categories" :key="category" @click="selectedCategory = category"
              :class="['categoryBtn', { 'selectedCategory': selectedCategory === category }]">
              <h3>{{ category }}</h3>
            </v-btn>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
            <div class="rating" v-if="selectedCategory === '다 읽은 책'"
              style="display: flex; flex-direction: column; width: 100%; gap: 6px; margin-top: 32px; ">
              <h4 style="color: #999;">책의 평점을 남겨주세요.</h4>
              <v-rating v-model="rating" background-color="purple" color="deep-purple-lighten-3" density="compact"
                length="5" half-increments clearable style="padding-left: -2px;"></v-rating>
            </div>
            <div class="bookCustomBox" style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
              <div class="bookDayBox">
                <div v-if="selectedCategory !== '읽고 싶은 책'"
                  style="flex: 1 1 0; display: flex; flex-direction: column; gap: 8px;">
                  <h4>독서 시작일</h4>
                  <input v-if="selectedCategory !== '읽고 싶은 책'" v-model="startDate" label="독서 시작일" type="date" dense
                    class="mt-4 selectDay" id="modalStartDate" style="width: 100%; display: block;"></input>
                </div>
                <div v-if="selectedCategory === '다 읽은 책'"
                  style="flex: 1 1 0; display: flex; flex-direction: column; gap: 8px;">
                  <h4>독서 종료일</h4>
                  <input v-if="selectedCategory === '다 읽은 책'" v-model="endDate" type="date" dense class="mt-4 selectDay"
                    id="modalEndDate" style="width: 100%; display: block;"></input>
                </div>
                <div v-if="selectedCategory !== '읽고 싶은 책'" class="selectDay" style="width: 100px;">
                  <input v-model="pages" dense class="mt-4 pageInput" id="modalPages" placeholder="전체">쪽
                </div>
                <div v-if="selectedCategory === '읽는 중인 책'" class="selectDay " style="width: 100px;">
                  <input v-if="selectedCategory === '읽는 중인 책'" v-model="readingPage" placeholder="읽은" dense
                    class="mt-4 pageInput" id="modalReadingPage">쪽
                </div>
              </div>
            </div>
            <div class="commentBox" style="padding: 0;">
              <textarea v-model="comment" label="코멘트" dense class="mt-4" id="modalComment"
                style="width: 100%;margin-top: 16px !important;padding: 0 16px 16px;"
                placeholder="감상평을 작성해 주세요"></textarea>
            </div>
          </div>
        </div>
      </v-card-text>
      <div class="bottomBtBox">
        <v-btn color="#A29cfe" @click="saveBook" class="mt-4 saveBt">
          <h5>저장</h5>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { supabase } from '@/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
// console.log('Router object:', router);

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

const saveBook = async () => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  // console.log('Session:', session);

  if (!session) {
    router.push('/BeforeLogin'); // 로그인 페이지로 리디렉션
    return;
  }

  const bookData = {
    user_id: session.user.id,
    title: selectedBook.value.title,
    publisher: selectedBook.value.publisher,
    datetime: selectedBook.value.datetime,
    thumbnail: selectedBook.value.thumbnail,
    authors: JSON.stringify(selectedBook.value.authors),
    isbn: selectedBook.value.isbn,
    pages: pages.value,
    reading_page: readingPage.value,
    comment: comment.value,
    start_date: startDate.value === '' ? null : startDate.value,
    end_date: endDate.value === '' ? null : endDate.value,
    rating: rating.value,
    category: selectedCategory.value
  };

  try {
    await bookStore.saveBook(bookData);
    bookStore.loadBooks();
    closeModal();
  } catch (error) {
    console.error('Error saving book:', error);
    alert('책 저장에 실패했습니다.');
  }
};

const formatDate = (datetime) => {
  if (!datetime) return '';
  return datetime.split('-')[0];
};

</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: 600;
}
h3 {
  font-weight: 400;
}
h5 {
  font-weight: 400;
}
.v-card-title {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 30px 30px 0 0;
  padding: 15px 36px 0 36px;
}
.bookCategory {
  color: #767676;
  font-size: 18px;
  display: flex;
  gap: 6px;
}
.bookDetailWrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 36px !important;
}
.bookDetailImage {
  width: 120px;
  height: 174px;
  border-radius: 6px;
  box-shadow: 0 4px 6px #dddddd;
  flex: none;
}
:deep(.v-img__img--contain) {
  object-fit: cover;
}
.bookDetailTxt {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.bookData {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 0;
  /* justify-content: space-between; */
  gap: 16px;
}
.bookSubData {
  display: flex;
  flex-direction: column;
  color: #767676;
  gap: 6px;
}

.bookCustomTxt {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.selectDay {
  color: #111;
  display: flex;
  border: 1px solid #dbdbdb;
  border-radius: 20px;
  height: 36px;
  align-items: center;
  justify-content: start;
  padding: 0 16px;
  margin-top: 0 !important;
  gap: 8px;
}
.bookDay {
  display: flex;
  flex-direction: column;
  flex: 3 1 0;
  gap: 4px;
}
.bookDayBox {
  display: flex;
  width: 100%;
  gap: 12px;
  align-items: end;
  margin-top: 18px;
  color: #999;
}
.bookDayBox h4, .rating h4 {
  padding: 0 6px;
}
.commentBox {
  display: flex;
  min-height: 210px;
  border: 1px solid #dbdbdb;
  border-radius: 20px;
  padding: 16px;
}
.bottomBtBox {
  display: flex;
  width: 100%;
  justify-content: end;
  background-color: #fff;
  bottom: 0;
  right: 0;
  padding: 20px 36px 24px;
  border-radius: 0 0 30px 30px;
  gap: 12px;
}
.bottomBt {
  width: 120px;
  height: 45px;
  box-shadow: none;
  border-radius: 50px;
  margin-top: 0 !important;
}
:deep(.v-field__outline) {
  display: none;
}
:deep(.v-field__overlay) {
  display: none;
}

.category-buttons {
  width: fit-content;
  display: flex;
  gap: 12px;
  margin-top: 24px !important;
  border-radius: 100px;
}
.categoryBtn {
  box-shadow: none;
  border: 1px solid #d3d3d3;
  border-radius: 20px;
}
.saveBt {
  width: 100%;
  height: 45px;
  border-radius: 20px;
  margin-top: 0 !important;

  box-shadow: none;
}

.bookDetailWrapper::-webkit-scrollbar, textarea::-webkit-scrollbar {
  bottom: 10px;
  width: 12px;
}
.bookDetailWrapper::-webkit-scrollbar-thumb, textarea::-webkit-scrollbar-thumb {
  background: #eee;
  border-radius: 10px;
}
.pageInput {
  width: 100%;
  margin-top: 0 !important;
  text-align: center;
}
Input:focus, textarea:focus {
  outline: none;
}
.selectedCategory {
  border: 2px solid #A29cfe;
  background: #f1efff;
  box-shadow: 0 4px 10px #fafaff;
}
</style>