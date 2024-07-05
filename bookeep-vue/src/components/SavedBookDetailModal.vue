<template>
    <v-dialog v-model="showSavedBookModal" max-width="500">
        <v-card>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-icon @click="closeSavedBookModal" size="x-small">mdi-close</v-icon>
            </v-card-title>
            <v-card-text class="bookDetailWrapper">
                <v-img :src="selectedSavedBook?.thumbnail" class="bookDetailImage" aspect-ratio="1.5"></v-img>
                <div v-if="isEditing">
                    <v-text-field v-model="editedBook.title" label="제목" dense class="mt-4"
                        id="modalTitle"></v-text-field>
                    <v-text-field v-model="editedBook.pages" label="페이지 수" dense class="mt-4"
                        id="modalPages"></v-text-field>
                    <v-text-field v-if="editedBookCategory === '읽는 중인 책'" v-model="editedBook.readingPage"
                        label="읽는 중인 페이지" dense class="mt-4" id="modalReadingPage"></v-text-field>
                    <v-text-field v-model="editedBook.comment" label="코멘트" dense class="mt-4"
                        id="modalComment"></v-text-field>
                    <v-select v-model="editedBookCategory" :items="categories" label="카테고리 선택" dense class="mt-4"
                        id="modalCategory"></v-select>
                    <v-text-field v-if="editedBookCategory !== '읽고 싶은 책'" v-model="editedBook.startDate" label="독서 시작일"
                        type="date" dense class="mt-4" id="modalStartDate"></v-text-field>
                    <v-text-field v-if="editedBookCategory === '다 읽은 책'" v-model="editedBook.endDate" label="독서 종료일"
                        type="date" dense class="mt-4" id="modalEndDate"></v-text-field>
                    <v-rating v-if="editedBookCategory !== '읽고 싶은 책'" v-model="editedBook.rating"
                        background-color="purple" color="deep-purple-lighten-3" density="compact" length="5"
                        half-increments clearable></v-rating>
                    <v-btn color="primary" @click="saveChanges" class="mt-4">저장</v-btn>
                </div>
                <div v-else>
                    <span>{{ selectedSavedBook?.title }}</span>
                    <p>{{ selectedSavedBook?.authors?.join(", ") || '작가 정보 없음' }}</p>
                    <p><span>ISBN:</span> {{ selectedSavedBook?.isbn }}</p>
                    <p>페이지 수: {{ selectedSavedBook?.pages }}</p>
                    <p v-if="selectedSavedBookCategory === '읽는 중인 책'">읽는 중인 페이지: {{ selectedSavedBook?.readingPage }}
                    </p>
                    <p v-if="selectedSavedBookCategory === '읽는 중인 책'">읽기 진행: {{
                        calculateReadingProgress(selectedSavedBook) }}%</p>
                    <p>코멘트: {{ selectedSavedBook?.comment }}</p>
                    <v-rating v-if="selectedSavedBookCategory !== '읽고 싶은 책'" :model-value="selectedSavedBook?.rating"
                        background-color="purple" color="deep-purple-lighten-3" density="compact" length="5"
                        half-increments readonly></v-rating>
                    <p v-if="selectedSavedBookCategory === '읽는 중인 책' || selectedSavedBookCategory === '다 읽은 책'">
                        읽기 시작한 날: {{ selectedSavedBook?.startDate }}
                    </p>
                    <p v-if="selectedSavedBookCategory === '다 읽은 책'">
                        종료 날: {{ selectedSavedBook?.endDate }}
                    </p>
                    <v-btn color="primary" @click="startEditing" class="mt-4">수정</v-btn>
                    <v-btn color="error" @click="deleteBook" class="mt-4">삭제하기</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore';

const bookStore = useBookStore();

const selectedSavedBook = computed(() => bookStore.selectedSavedBook);
const showSavedBookModal = computed(() => bookStore.showSavedBookModal);
const selectedSavedBookCategory = computed(() => bookStore.selectedSavedBookCategory);

const categories = bookStore.categories;

const editedBook = ref({ ...selectedSavedBook.value, readingPage: selectedSavedBook.value?.readingPage || '' });
const editedBookCategory = ref(selectedSavedBookCategory.value);
const isEditing = ref(false);


watch(selectedSavedBook, (newBook) => {
    if (newBook) {
        editedBook.value = { ...newBook, readingPage: newBook.readingPage || '' };
    }
});

watch(selectedSavedBookCategory, (newCategory) => {
    editedBookCategory.value = newCategory;
});

const calculateReadingProgress = (book) => {
    if (!book || !book.pages || !book.readingPage) {
        return 0;
    }
    return Math.round((book.readingPage / book.pages) * 100);
};

const startEditing = () => {
    isEditing.value = true;
};

const saveChanges = () => {
    bookStore.updateSavedBook(editedBook.value, editedBookCategory.value);
    alert('저장되었습니다.');
    window.location.reload(); // 페이지 새로고침
    bookStore.closeSavedBookModal();
    isEditing.value = false;
};

const closeSavedBookModal = () => {
    bookStore.closeSavedBookModal();
    isEditing.value = false;
};

const deleteBook = () => {
    bookStore.deleteSavedBook(selectedSavedBook.value.isbn, selectedSavedBookCategory.value);
    alert('삭제되었습니다.');
    window.location.reload(); // 페이지 새로고침
    bookStore.closeSavedBookModal();
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
    flex-direction: column;
    align-items: center;
    padding: 16px;
}

.bookDetailImage {
    height: auto;
    width: 100%;
    max-width: 200px;
    margin-bottom: 16px;
}
</style>