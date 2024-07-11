<template>
    <v-dialog v-model="showSavedBookModal" max-width="500">
        <v-card>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-icon @click="closeSavedBookModal" size="x-small">mdi-close</v-icon>
            </v-card-title>
            <v-card-text class="bookDetailWrapper">
                <v-img :src="selectedSavedBook?.thumbnail" class="bookDetailImage" aspect-ratio="1.5"></v-img>
                <div v-if="isEditing" class="bookDetailTxt">
                    <v-text-field v-model="editedBook.title" label="제목" dense class="mt-4"
                        id="modalTitle"></v-text-field>
                    <v-text-field v-model="editedBook.pages" label="페이지 수" dense class="mt-4"
                        id="modalPages"></v-text-field>
                    <v-text-field v-if="editedBookCategory === '읽는 중인 책'" v-model="editedBook.reading_page"
                        label="읽는 중인 페이지" dense class="mt-4" id="modalReadingPage"></v-text-field>
                    <v-text-field v-model="editedBook.comment" label="코멘트" dense class="mt-4"
                        id="modalComment"></v-text-field>
                    <v-select v-model="editedBookCategory" :items="categories" label="카테고리 선택" dense class="mt-4"
                        id="modalCategory"></v-select>
                    <v-text-field v-if="editedBookCategory !== '읽고 싶은 책'" v-model="editedBook.start_date" label="독서 시작일"
                        type="date" dense class="mt-4" id="modalStartDate"></v-text-field>
                    <v-text-field v-if="editedBookCategory === '다 읽은 책'" v-model="editedBook.end_date" label="독서 종료일"
                        type="date" dense class="mt-4" id="modalEndDate"></v-text-field>
                    <v-rating v-model="editedBook.rating" density="compact" background-color="purple"
                        color="deep-purple-lighten-3" length="5" half-increments clearable
                        v-if="editedBookCategory === '다 읽은 책'"></v-rating>
                    <v-btn color="primary" @click="saveChanges" class="mt-4">저장</v-btn>
                </div>
                <div v-else class="bookDetailTxt">
                    <span>{{ selectedSavedBook?.title }}</span>
                    <p>{{ Array.isArray(selectedSavedBook?.authors) ? selectedSavedBook?.authors.join(", ") : '작가 정보 없음'
                        }}</p>
                    <p><span>ISBN:</span> {{ selectedSavedBook?.isbn }}</p>
                    <!-- <p>페이지 수: {{ selectedSavedBook?.pages }}</p> -->
                    <p v-if="selectedSavedBookCategory === '읽는 중인 책' && selectedSavedBook?.reading_page">
                        <span>독서 진행률: {{ selectedSavedBook?.reading_page }} / {{ selectedSavedBook?.pages }}</span>
                        <!-- <v-progress-linear
                            :model-value="calculateReadingPercentage(selectedSavedBook.reading_page, selectedSavedBook.pages)"
                            bg-color="deep-purple-lighten-3" color="deep-purple-lighten-1" height="10">
                        </v-progress-linear> -->
                    </p>
                    <p>코멘트: {{ selectedSavedBook?.comment }}</p>
                    <v-rating :model-value="selectedSavedBook?.rating" density="compact" background-color="purple"
                        color="deep-purple-lighten-3" length="5" half-increments readonly
                        v-if="selectedSavedBookCategory === '다 읽은 책'"></v-rating>
                    <p v-if="selectedSavedBookCategory === '읽는 중인 책' || selectedSavedBookCategory === '다 읽은 책'">독서 시작일 :
                        {{ selectedSavedBook?.start_date }}</p>
                    <p v-if="selectedSavedBookCategory === '다 읽은 책'">독서 종료일 : {{ selectedSavedBook?.end_date }}</p>
                    <v-btn color="primary" @click="startEditing" class="mt-4">수정</v-btn>
                    <v-btn color="error" @click="deleteBook" class="mt-4">삭제하기</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore';

const bookStore = useBookStore();

const selectedSavedBook = computed(() => bookStore.selectedSavedBook);
const showSavedBookModal = computed(() => bookStore.showSavedBookModal);
const selectedSavedBookCategory = computed(() => bookStore.selectedSavedBookCategory);

const categories = bookStore.categories;

const editedBook = ref({ ...selectedSavedBook.value });
const editedBookCategory = ref(selectedSavedBookCategory.value);
const isEditing = ref(false);

watch(selectedSavedBook, (newBook) => {
    if (newBook) {
        editedBook.value = { ...newBook, reading_page: newBook.reading_page || '' };
    }
});

watch(selectedSavedBookCategory, (newCategory) => {
    editedBookCategory.value = newCategory;
});

const startEditing = () => {
    isEditing.value = true;
};

const saveChanges = async () => {
    try {
        await bookStore.updateSavedBook(editedBook.value, editedBookCategory.value);
        // alert('책이 업데이트되었습니다.');
    } catch (error) {
        console.error('Error updating book:', error);
        alert('책 업데이트에 실패했습니다.');
    } finally {
        bookStore.closeSavedBookModal();
        isEditing.value = false;
    }
};

const deleteBook = async () => {
    try {
        await bookStore.deleteSavedBook(editedBook.value.id);
        alert('책이 삭제되었습니다.');
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('책 삭제에 실패했습니다.');
    } finally {
        bookStore.closeSavedBookModal();
        isEditing.value = false;
    }
};

const closeSavedBookModal = () => {
    bookStore.closeSavedBookModal();
    isEditing.value = false;
};

const calculateReadingPercentage = (readingPage, totalPage) => {
    if (!readingPage || !totalPage || totalPage === 0) return 0;
    return Math.floor((readingPage / totalPage) * 100);
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
    /* max-width: 200px; */
    margin-bottom: 16px;
    border-radius: 26px;
}
:deep(.v-img__img--contain) {
    object-fit: cover;
}
.bookDetailTxt {
    width: 100%;
}
</style>