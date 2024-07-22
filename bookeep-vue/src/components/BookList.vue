<template>
    <v-container style="padding: 0.5%; max-width: 2000px;">
        <v-row v-if="filteredBooks && filteredBooks.length"
            style="display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));">
            <v-col v-for="book in filteredBooks" :key="book.isbn" style="padding: 8px;">
                <v-card @click="openBookDetail(book, props.category)" class="bookCard">
                    <v-card-text class="bookThumbnail">
                        <v-img :src="book.thumbnail" />
                    </v-card-text>
                    <div
                        style="width: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 8px 0;">
                        <div>
                            <p
                                style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
                                {{ book.title }}</p>
                            <h3>{{ book.authors.join(", ") || '작가 정보 없음' }}</h3>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; flex-direction: row; gap: 16px;">
                                <h4 style="padding-right: 12px; box-shadow: 5px 0 0 -3px #c4c4c4;">발행연도 : {{
                                    formatDate(book?.datetime) || '정보 없음' }}</h4>
                                <h4>출판사 : {{ book?.publisher || '정보 없음' }}</h4>
                            </div>
                            <h4>ISBN: {{ book?.isbn }}</h4>
                        </div>
                        <v-rating :model-value="book.rating" density="compact" background-color="purple"
                            color="deep-purple-lighten-3" length="5" half-increments readonly
                            v-if="props.category === '다 읽은 책'"></v-rating>
                        <div v-if="props.category === '읽는 중인 책'"
                            style="width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                            <v-progress-linear :model-value="calculateReadingPercentage(book.reading_page, book.pages)"
                                color="deep-purple-lighten-3" height="14" bg-color="grey lighten-4"
                                style="border-radius: 50px;">
                            </v-progress-linear>
                            <h3>({{ calculateReadingPercentage(book.reading_page, book.pages) }}%)</h3>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col style="display: flex; justify-content: center; padding:80px 0;">
                <h3>저장된 책이 없습니다.</h3>
            </v-col>
        </v-row>
        <SavedBookDetailModal />
    </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import SavedBookDetailModal from './SavedBookDetailModal.vue';

const bookStore = useBookStore();

const props = defineProps({
    category: {
        type: String,
        required: true
    }
});

// 카테고리에 따라 필터링된 책 목록
const filteredBooks = computed(() => {
    if (props.category === '읽고 싶은 책') {
        return bookStore.books?.wantToRead || [];
    } else if (props.category === '읽는 중인 책') {
        return bookStore.books?.reading || [];
    } else if (props.category === '다 읽은 책') {
        return bookStore.books?.finished || [];
    } else {
        return [];
    }
});

const openBookDetail = (book, category) => {
    bookStore.selectSavedBook(book, category);
};

// 읽는 중인 책일 때 전체 페이지수와 읽는 중 페이지수에 따른 독서 진행률 출력
const calculateReadingPercentage = (readingPage, totalPages) => {
    if (!totalPages || totalPages === 0) return 0;
    return Math.floor((readingPage / totalPages) * 100);
};

// 컴포넌트가 마운트될 때 책 목록 불러오기
onMounted(() => {
    bookStore.loadBooks();
});

// 카테고리가 변경될 때마다 책 목록 불러오기
watch(() => props.category, () => {
    bookStore.loadBooks();
});

const formatDate = (datetime) => {
    if (!datetime) return '';
    return datetime.split('-')[0];
};

</script>

<style scoped>
.bookCard {

    box-shadow: none;
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

:deep(.v-field__outline) {
    display: none;
}
</style>