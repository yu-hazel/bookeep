<template>
    <v-container style="padding: 0.5%; max-width: 2000px;">
        <v-row v-if="filteredBooks && filteredBooks.length">
            <v-col xs="12" sm="6" md="4" lg="3" v-for="book in filteredBooks" :key="book.isbn">
                <v-card @click="openBookDetail(book, props.category)" class="bookCard">
                    <v-img :src="book.thumbnail" aspect-ratio="1"></v-img>
                    <v-card-text class="cardText">
                        <p v-if="props.category === '읽는 중인 책'">
                            <v-progress-linear :model-value="calculateReadingPercentage(book.reading_page, book.pages)"
                                color="deep-purple-lighten-3" height="5" bg-color="grey lighten-4">
                            </v-progress-linear>
                            ({{ calculateReadingPercentage(book.reading_page, book.pages) }}%)
                        </p>
                        <!-- <br> -->
                        <!-- <v-rating :model-value="book.rating" density="compact" background-color="purple"
                            color="deep-purple-lighten-3" length="5" half-increments readonly
                            v-if="props.category === '다 읽은 책'"></v-rating> -->
                        <div class="bookData">
                            <h4>{{ book.authors.join(", ") || '작가 정보 없음' }}</h4>
                            <h5 class="bookListTitle">{{ book.title }}</h5>
                        </div>
                        <!-- <p v-if="props.category === '읽는 중인 책'">{{ book.start_date }} ~</p> -->
                        <!-- <p v-if="props.category === '다 읽은 책'">{{ book.start_date }} ~ {{ book.end_date }}</p> -->
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col>
                <h5>저장된 책이 없습니다.</h5>
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


</script>

<style scoped>
.bookCard {
    box-shadow: none;
    overflow: visible;
}
.v-img {
    box-shadow: 0px 4px 10px #D6D5E9;
    border-radius: 16px;
    padding: 0 0 60%;
}
:deep(.v-img__img--contain) {
    object-fit: cover;
}
.v-card-text {
    padding: 0 0 0 8px;
}
.cardText {
    padding: 8% 0 8% 8px;
}
.v-row {
    margin: 0 -3%;
}
.v-col {
    padding: 0 3%;
}
.bookData {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.bookListTitle {
    font-weight: 600;
}
</style>