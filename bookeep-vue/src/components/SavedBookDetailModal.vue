<template>
    <v-dialog v-model="showSavedBookModal" max-width="650" max-height="850">
        <v-card style="border-radius: 30px; box-shadow: 0 4px 25px #767676; height: 100%;">
            <v-card-title>
                <v-spacer class="bookCategory">
                    <v-icon style="color: #A29cfe;">mdi-check</v-icon>{{ selectedSavedBookCategory }}</v-spacer>
                <v-icon @click="closeSavedBookModal" size="x-small"
                    style="position: absolute; right: 36px; ">mdi-close</v-icon>
            </v-card-title>
            <v-card-text class="bookDetailWrapper">
                <v-img :src="selectedSavedBook?.thumbnail" class="bookDetailImage" aspect-ratio="1.5"></v-img>
                <div v-if="isEditing" class="bookDetailTxt">
                    <!-- <v-text-field v-model="editedBook.title" label="제목" dense class="mt-4" id="modalTitle"></v-text-field> -->
                    <!-- <h1>{{ selectedSavedBook?.title }}</h1> -->
                    <div class="category-buttons mt-4">
                        <v-btn v-for="category in categories" :key="category" @click="editedBookCategory = category"
                            :color="editedBookCategory === category ? '#A29cfe' : ''" class="cartegoryBt">
                            {{ category }}
                        </v-btn>
                    </div>
                    <v-rating v-model="editedBook.rating" density="compact" background-color="purple"
                        color="deep-purple-lighten-3" length="5" half-increments clearable
                        v-if="editedBookCategory === '다 읽은 책'"></v-rating>
                    <div class="bookCustomBox" style="display: flex; flex-direction: column; gap: 12px;">
                        <div class="bookDayBox">
                            <div v-if="editedBookCategory !== '읽고 싶은 책'">
                                <h4>독서 시작일</h4>
                                <v-text-field v-if="editedBookCategory !== '읽고 싶은 책'" v-model="editedBook.start_date"
                                    type="date" dense class="mt-4 selectDay" id="modalStartDate"></v-text-field>
                            </div>
                            <div v-if="editedBookCategory === '다 읽은 책'">
                                <h4>독서 종료일</h4>
                                <v-text-field v-if="editedBookCategory === '다 읽은 책'" v-model="editedBook.end_date"
                                    type="date" dense class="mt-4 selectDay" id="modalEndDate"></v-text-field>
                            </div>
                            <div class="bookPage selectDay" style="padding: 0;">
                                <input v-model="editedBook.pages" dense class="mt-4" id="modalPages" placeholder="전체 페이지">쪽
                            </div>
                            <div v-if="editedBookCategory === '읽는 중인 책'" class="bookPage selectDay">
                                <input v-model="editedBook.reading_page" placeholder="읽은 페이지" dense class="mt-4"
                                    id="modalReadingPage">쪽
                            </div>
                        </div>
                        <div class="commentBox">
                            <textarea v-model="editedBook.comment" dense class="mt-4" id="modalComment"
                                style="width: 100%;"></textarea>
                        </div>
                    </div>

                    <!-- <div class="bottomBtBox"><v-btn color="#A29cfe" @click="saveChanges" class="mt-4 saveBt">
                            <h5>저장</h5>
                        </v-btn>
                    </div> -->
                </div>


                <div v-else class="bookDetailTxt">
                    <div class="bookData">
                        <div style="display: flex; flex-direction: row; justify-content: space-between;">
                            <h1>{{ selectedSavedBook?.title }}</h1>
                            <p>
                                <v-rating :model-value="selectedSavedBook?.rating" density="compact"
                                    background-color="purple" color="deep-purple-lighten-3" length="5" half-increments
                                    readonly v-if="selectedSavedBookCategory === '다 읽은 책'"></v-rating>
                            </p>
                        </div>
                        <div class="bookSubData">
                            <h5 class="name">{{ Array.isArray(selectedSavedBook?.authors) ?
                                selectedSavedBook?.authors.join(", ") :
                                '작가 정보 없음'
                            }}</h5>
                            <h5>ISBN : {{ selectedSavedBook?.isbn }}</h5>
                        </div>
                    </div>
                    <p v-if="selectedSavedBookCategory === '읽는 중인 책' && selectedSavedBook?.reading_page">
                        <span>독서 진행률: {{ selectedSavedBook?.reading_page }} / {{ selectedSavedBook?.pages }}</span>
                        <!-- <v-progress-linear
                            :model-value="calculateReadingPercentage(selectedSavedBook.reading_page, selectedSavedBook.pages)"
                            bg-color="deep-purple-lighten-3" color="deep-purple-lighten-1" height="10">
                        </v-progress-linear> -->
                    </p>

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
                                    <h4>{{
                                        selectedSavedBook?.start_date }}</h4>
                                </div>
                            </div>
                            <div v-if="selectedSavedBookCategory === '다 읽은 책'" class="bookDay">
                                <h4>독서 종료일</h4>
                                <div class="selectDay">
                                    <v-icon style="font-size: 18px; font-weight: 600;">mdi-calendar-blank</v-icon>
                                    <h4>{{
                                        selectedSavedBook?.end_date }}</h4>
                                </div>
                            </div>
                            <div class="selectDay bookPage">
                                <h4>{{ selectedSavedBook?.pages }}쪽</h4>
                            </div>
                        </div>
                        <div class="commentBox">
                            <h4>{{ selectedSavedBook?.comment }}</h4>
                        </div>
                    </div>


                </div>

            </v-card-text>
            <div class="bottomBtBox">
                <v-btn @click="deleteBook" class="mt-4 bottomBt deleteBt">
                    <h5>삭제하기</h5>
                </v-btn>
                <v-btn color="#A29cfe" @click="startEditing" class="mt-4 bottomBt">
                    <h5>수정하기</h5>
                </v-btn>
            </div>
            <div class="bottomBtBox"><v-btn color="#A29cfe" @click="saveChanges" class="mt-4 saveBt">
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
    font-size: 28px;
}
h5 {
    font-weight: 400;
}
.v-card-title {
    width: 100%;
    height: 85px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 30px 30px 0 0;
    padding: 0 50px;
}
.bookCategory {
    font-size: 18px;
    display: flex;
    gap: 6px;
}
.bookDetailWrapper {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 40px !important;
}
.bookDetailImage {
    max-height: 250px;
    width: 100%;
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
    height: 100%;
    gap: 24px;
}
.bookData {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 0.5%;
}
.bookSubData {
    display: flex;
    gap: 10px;
}
.name {
    box-shadow: 10px 0 0 -8px #767676;
    padding-right: 5px;
}

.bookCustomTxt {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.selectDay {
    display: flex;
    border: 1px solid #d3d3d3;
    border-radius: 20px;
    height: 36px;
    align-items: center;
    justify-content: start;
    padding: 0 16px;
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
}
.bookDayBox h4 {
    padding: 0 8px;
}
.commentBox {
    display: flex;
    min-height: 180px;
    border: 1px solid #d3d3d3;
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
    padding: 20px 50px;
    border-radius: 0 0 30px 30px;
    gap: 12px;
}
.bottomBt {
    width: 120px;
    height: 45px;
    box-shadow: none;
    border-radius: 20px;
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
    display: flex;
    gap: 10px;
}
.cartegoryBt {
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

.bookDetailWrapper::-webkit-scrollbar {
    bottom: 10px;
    width: 12px;
}
.bookDetailWrapper::-webkit-scrollbar-thumb {
    background: #eee;
    border-radius: 10px;
}
</style>