<template>
    <v-dialog v-model="showSavedBookModal" max-width="650" height="850px">
        <v-card style="border-radius: 30px; box-shadow: 0 4px 25px #767676; height: 100%;">
            <v-card-title>
                <v-spacer class="bookCategory">
                    <v-icon style="color: #A29cfe;">mdi-check</v-icon>{{ selectedSavedBookCategory }}</v-spacer>
                <v-icon @click="closeSavedBookModal" size="x-small">mdi-close</v-icon>
            </v-card-title>
            <v-card-text class="bookDetailWrapper" style="padding: 97px 50px;">
                <v-img :src="selectedSavedBook?.thumbnail" class="bookDetailImage" aspect-ratio="1.5"></v-img>
                <div v-if="isEditing" class="bookDetailTxt">
                    <!-- <v-text-field v-model="editedBook.title" label="제목" dense class="mt-4" id="modalTitle"></v-text-field> -->
                    <h1>{{ selectedSavedBook?.title }}</h1>
                    <div class="category-buttons mt-4">
                        <v-btn v-for="category in categories" :key="category" @click="editedBookCategory = category"
                            :color="editedBookCategory === category ? 'primary' : ''">
                            {{ category }}
                        </v-btn>
                    </div>
                    <v-rating v-model="editedBook.rating" density="compact" background-color="purple"
                        color="deep-purple-lighten-3" length="5" half-increments clearable
                        v-if="editedBookCategory === '다 읽은 책'"></v-rating>
                    <div class="bookDayBox">
                        <div v-if="editedBookCategory !== '읽고 싶은 책'">
                            <h3>독서 시작일</h3>
                            <v-text-field v-if="editedBookCategory !== '읽고 싶은 책'" v-model="editedBook.start_date"
                                type="date" dense class="mt-4 selectDay" id="modalStartDate"></v-text-field>
                        </div>
                        <div v-if="editedBookCategory === '다 읽은 책'">
                            <h3>독서 종료일</h3>
                            <v-text-field v-if="editedBookCategory === '다 읽은 책'" v-model="editedBook.end_date" type="date"
                                dense class="mt-4 selectDay" id="modalEndDate"></v-text-field>
                        </div>
                        <v-text-field v-model="editedBook.pages" label="페이지 수" dense class="mt-4"
                            id="modalPages"></v-text-field>

                        <v-text-field v-if="editedBookCategory === '읽는 중인 책'" v-model="editedBook.reading_page"
                            label="읽는 중인 페이지" dense class="mt-4" id="modalReadingPage"></v-text-field>
                    </div>
                    <div class="commentBox">
                        <v-text-field v-model="editedBook.comment" dense class="mt-4" id="modalComment"></v-text-field>
                    </div>

                    <div class="bottomBt"><v-btn color="primary" @click="saveChanges" class="mt-4 saveBt">저장</v-btn></div>
                </div>
                <div v-else class="bookDetailTxt">
                    <div class="bookData">
                        <h1>{{ selectedSavedBook?.title }}</h1>
                        <div class="bookSubData">
                            <h2 class="name">{{ Array.isArray(selectedSavedBook?.authors) ?
                                selectedSavedBook?.authors.join(", ") :
                                '작가 정보 없음'
                            }}</h2>
                            <h2>ISBN : {{ selectedSavedBook?.isbn }}</h2>
                        </div>
                    </div>
                    <p v-if="selectedSavedBookCategory === '읽는 중인 책' && selectedSavedBook?.reading_page">
                        <span>독서 진행률: {{ selectedSavedBook?.reading_page }} / {{ selectedSavedBook?.pages }}</span>
                        <!-- <v-progress-linear
                            :model-value="calculateReadingPercentage(selectedSavedBook.reading_page, selectedSavedBook.pages)"
                            bg-color="deep-purple-lighten-3" color="deep-purple-lighten-1" height="10">
                        </v-progress-linear> -->
                    </p>
                    <p>
                        <v-rating :model-value="selectedSavedBook?.rating" density="compact" background-color="purple"
                            color="deep-purple-lighten-3" length="5" half-increments readonly
                            v-if="selectedSavedBookCategory === '다 읽은 책'"></v-rating>
                    </p>
                    <div class="bookCustomTxt">
                        <div class="bookDayBox">
                            <div v-if="selectedSavedBookCategory === '읽는 중인 책' || selectedSavedBookCategory === '다 읽은 책'"
                                class="bookDay">
                                <h3>독서 시작일</h3>
                                <h3 class="selectDay"> <v-icon>mdi-calendar-blank</v-icon>{{
                                    selectedSavedBook?.start_date }} </h3>
                            </div>
                            <div v-if="selectedSavedBookCategory === '다 읽은 책'" class="bookDay">
                                <h3>독서 종료일</h3>
                                <h3 class="selectDay"><v-icon>mdi-calendar-blank</v-icon>{{ selectedSavedBook?.end_date }}
                                </h3>
                            </div>
                            <div class="selectDay bookPage">
                                <h3>{{ selectedSavedBook?.pages }}쪽</h3>
                            </div>
                        </div>
                        <div class="commentBox">
                            <h4>{{ selectedSavedBook?.comment }}</h4>
                        </div>
                    </div>

                    <div class="bottomBt">
                        <v-btn color="primary" @click="startEditing" class="mt-4">수정</v-btn>
                        <v-btn color="error" @click="deleteBook" class="mt-4">삭제하기</v-btn>
                    </div>
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
h1 {
    font-size: 28px;
}
h2 {
    font-size: 18px;
}
h3 {
    font-size: 14px;
}
.v-card-title {
    width: 100%;
    height: 87px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    background-color: #fff;
    z-index: 100;
    border-radius: 30px 30px 0 0;
    padding: 0 50px;
}
.bookCategory {
    font-size: 18px;
    display: flex;
    gap: 6px;
}
/* 
.bookDetailWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 50px;
} */

.bookDetailImage {
    max-height: 250px;
    width: 100%;
    /* max-width: 200px; */
    margin-bottom: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 20px #cbcbcb;
}
:deep(.v-img__img--contain) {
    object-fit: cover;
}
.bookDetailTxt {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* height: 100%; */
    position: relative;
}
.bookData {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.bookSubData {
    display: flex;
    gap: 10px;
}
.name {
    box-shadow: 8px 0 0 -5px #767676;
    padding-right: 5px;
}

.bookCustomTxt {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.selectDay {
    display: flex;
    border: 1px solid #767676;
    border-radius: 20px;
    height: 40px;
    width: 100%;
    align-items: center;
    justify-content: start;
    padding: 0 16px;
}
.bookDay {
    flex: 3 1 0;
}
.bookDayBox {
    display: flex;
    width: 100%;
    gap: 12px;
    align-items: end;
}
.commentBox {
    display: flex;
    min-height: 180px;
    border: 1px solid #767676;
    border-radius: 20px;
}
.bottomBt {
    position: fixed;
    display: flex;
    width: 100%;
    justify-content: end;
    background-color: #fff;
    bottom: 0;
    right: 0;
    padding: 20px 50px;
    border-radius: 0 0 30px 30px;
}
.bookPage {
    flex: 1 1 0
}

:deep(.v-field__outline) {
    display: none;
}
:deep(.v-field__overlay) {
    display: none;
}

.category-buttons {
    display: flex;
    gap: 10px;
}
.saveBt {
    width: 100%;
}
</style>