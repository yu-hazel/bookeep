<template>
    <v-dialog v-model="showSavedBookModal" max-width="550" max-height="850">
        <v-card style="border-radius: 30px; box-shadow: 0 4px 25px #767676; height: 100%;">
            <v-card-title>
                <v-spacer class="bookCategory">
                    <v-icon style="color: #A29cfe;">mdi-check</v-icon>{{ selectedSavedBookCategory }}</v-spacer>
                <v-icon @click="closeSavedBookModal" size="x-small"
                    style="position: absolute; right: 36px; top: 32px;">mdi-close</v-icon>
            </v-card-title>
            <v-card-text class="bookDetailWrapper">
                <div class="DataBox" style="display: flex; gap: 32px; flex-direction: row;">
                    <v-img :src="selectedSavedBook?.thumbnail" class="bookDetailImage" aspect-ratio="1.5"></v-img>
                    <div class="bookData">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <h1>{{ selectedSavedBook?.title }}</h1>
                            <div class="bookSubData">
                                <!-- <h5 class="name">{{ Array.isArray(selectedSavedBook?.authors) ?
                                selectedSavedBook?.authors.join(", ") :
                                '작가 정보 없음'
                                }}</h5> -->
                                <h3>작가 : {{
                                    selectedSavedBook?.authors.join(", ") || '작가 정보 없음' }}</h3>
                                <h3>ISBN : {{ selectedSavedBook?.isbn }}</h3>
                            </div>
                        </div>
                        <h3 v-if="selectedSavedBookCategory === '다 읽은 책'"
                            style="display: flex; align-items: center; gap: 8px; color: #767676;">
                            <v-rating :model-value="selectedSavedBook?.rating" density="compact" background-color="purple"
                                color="deep-purple-lighten-3" length="5" half-increments readonly
                                v-if="selectedSavedBookCategory === '다 읽은 책'" style="padding-left: -2px;"></v-rating>
                            <!-- <v-icon style="color: #A29cfe;">mdi-star</v-icon> -->
                            ({{ selectedSavedBook?.rating }}/5)
                        </h3>
                        <div v-if="selectedSavedBookCategory === '읽는 중인 책' && selectedSavedBook?.reading_page"
                            style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                            <v-progress-linear
                                :model-value="calculateReadingPercentage(selectedSavedBook.reading_page, selectedSavedBook.pages)"
                                bg-color="deep-purple-lighten-3" color="deep-purple-lighten-1" height="15"
                                style="width: 75%; border-radius: 50px;">
                            </v-progress-linear>
                            <h3>{{ selectedSavedBook?.reading_page }} / {{
                                selectedSavedBook?.pages }}</h3>
                        </div>
                    </div>
                </div>
                <div v-if="isEditing" class="bookDetailTxt">
                    <!-- <v-text-field v-model="editedBook.title" label="제목" dense class="mt-4" id="modalTitle"></v-text-field> -->
                    <!-- <h1>{{ selectedSavedBook?.title }}</h1> -->
                    <div class="category-buttons mt-4">
                        <v-btn v-for="category in categories" :key="category" @click="editedBookCategory = category"
                            :class="['categoryBtn', { 'selectedCategory': editedBookCategory === category }]">
                            <h3>{{ category }}</h3>
                        </v-btn>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
                        <div class="rating" v-if="editedBookCategory === '다 읽은 책'"
                            style="display: flex; flex-direction: column; width: 100%; gap: 6px; margin-top: 32px; ">
                            <h4>책의 평점을 남겨주세요.</h4>
                            <v-rating v-model="editedBook.rating" density="compact" background-color="purple"
                                color="deep-purple-lighten-3" length="5" size="x-large" half-increments
                                clearable></v-rating>
                        </div>
                        <!-- 별점 크기 자체는 size="x-large" 로 조절이 가능한데, 그렇게 되면 간격이 벌어져...🥹 -->
                        <div class="bookCustomBox" style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
                            <div class="bookDayBox">
                                <div v-if="editedBookCategory !== '읽고 싶은 책'"
                                    style="flex: 1 1 0; display: flex; flex-direction: column; gap: 8px;">
                                    <h4>독서 시작일</h4>
                                    <input v-if="editedBookCategory !== '읽고 싶은 책'" v-model="editedBook.start_date"
                                        type="date" dense class="mt-4 selectDay" id="modalStartDate"
                                        style="width: 100%; display: block;"></input>
                                </div>
                                <div v-if="editedBookCategory === '다 읽은 책'"
                                    style="flex: 1 1 0; display: flex; flex-direction: column; gap: 8px;">
                                    <h4>독서 종료일</h4>
                                    <input v-if="editedBookCategory === '다 읽은 책'" v-model="editedBook.end_date" type="date"
                                        dense class="mt-4 selectDay" id="modalEndDate"
                                        style="width: 100%; display: block;"></input>
                                </div>
                                <div v-if="editedBookCategory !== '읽고 싶은 책'" class="selectDay" style="width: 100px;">
                                    <input v-model="editedBook.pages" dense class="mt-4 pageInput" id="modalPages"
                                        placeholder="전체">쪽
                                </div>
                                <div v-if="editedBookCategory === '읽는 중인 책'" class="selectDay " style="width: 100px;">
                                    <input v-model="editedBook.reading_page" placeholder="읽은" dense class="mt-4 pageInput"
                                        id="modalReadingPage">쪽
                                </div>
                            </div>
                            <div class="commentBox" style="padding: 0;">
                                <textarea v-model="editedBook.comment" dense class="mt-4 " id="modalComment"
                                    style="width: 100%;margin-top: 16px !important;padding: 0 16px 16px;"
                                    placeholder="감상평을 작성해 주세요"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="bottomBtBox"><v-btn color="#A29cfe" @click="saveChanges" class="mt-4 saveBt">
                            <h5>저장</h5>
                        </v-btn>
                    </div> -->
                </div>


                <div v-else class="bookDetailTxt">

                    <div class="bookCustomTxt">
                        <!-- <p>
                            <v-rating :model-value="selectedSavedBook?.rating" density="compact" background-color="purple"
                                color="deep-purple-lighten-3" length="5" half-increments readonly
                                v-if="selectedSavedBookCategory === '다 읽은 책'"></v-rating>
                        </p> -->
                        <div class="bookDayBox">
                            <div v-if="selectedSavedBookCategory === '읽는 중인 책' || selectedSavedBookCategory === '다 읽은 책'"
                                class="bookDay">
                                <h4>독서 시작일</h4>
                                <div class="selectDay">
                                    <v-icon style="font-size: 18px; font-weight: 600;">mdi-calendar-blank</v-icon>
                                    <h3>{{
                                        selectedSavedBook?.start_date || '연도-월-일' }}</h3>
                                </div>
                            </div>
                            <div v-if="selectedSavedBookCategory === '다 읽은 책'" class="bookDay">
                                <h4>독서 종료일</h4>
                                <div class="selectDay">
                                    <v-icon style="font-size: 18px; font-weight: 600;">mdi-calendar-blank</v-icon>
                                    <h3>{{
                                        selectedSavedBook?.end_date || '연도-월-일' }}</h3>
                                </div>
                            </div>
                            <div v-if="selectedSavedBookCategory === '읽는 중인 책' || selectedSavedBookCategory === '다 읽은 책'"
                                class="selectDay">
                                <h3>{{ selectedSavedBook?.pages || 0 }}쪽</h3>
                            </div>
                            <div v-if="selectedSavedBookCategory === '읽는 중인 책'" class="selectDay">
                                <h3>{{ selectedSavedBook?.reading_page || 0 }}쪽</h3>
                            </div>
                        </div>
                        <div class="commentBox">
                            <h4>{{ selectedSavedBook?.comment }}</h4>
                        </div>
                    </div>


                </div>

            </v-card-text>
            <div v-if="!isEditing" class="bottomBtBox">
                <v-btn @click="deleteBook" class="mt-4 bottomBt deleteBt">
                    <h5>삭제하기</h5>
                </v-btn>
                <v-btn color="#A29cfe" @click="startEditing" class="mt-4 bottomBt">
                    <h5>수정하기</h5>
                </v-btn>
            </div>
            <div v-if="isEditing" class="bottomBtBox"><v-btn color="#A29cfe" @click="saveChanges" class="mt-4 saveBt">
                    <h5>저장</h5>
                </v-btn>
            </div>
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
    font-size: 24px;
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
    padding: 15px 40px 0 40px;
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
    padding: 10px 40px !important;
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
/* :deep(.v-rating__wrapper) {
    width: 35px;
    justify-content: center;
    height: 35px;
    align-items: center;
} */
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
    padding: 4px 0;
    justify-content: space-between;
}
.bookSubData {
    display: flex;
    flex-direction: column;
    color: #767676;
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
    padding: 20px 40px 24px;
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
.deleteBt {
    border: 1px solid #cbcbcb;
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