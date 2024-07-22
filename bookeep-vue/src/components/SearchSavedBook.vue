<template>
    <v-container class="searchBox" style="max-width: 2000px; margin: 0; padding: 8px 0;">
        <v-text-field v-model="searchQuery" rounded dense clearable @input="searchBooks" prepend-inner-icon="mdi-magnify"
            append-inner-icon="mdi-arrow-right" class="userInput" style=" width: 100%;"
            placeholder="책 이름 또는 저자명을 입력하세요"></v-text-field>
        <v-row v-if="filteredBooks.length" class="saveBookBox"
            style="display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));">
            <v-col v-for="book in filteredBooks" :key="book.id" style="padding: 8px;">
                <v-card class="bookCard" @click="openBookDetail(book)">
                    <v-card-text class="bookThumbnail">
                        <v-img :src="book.thumbnail"></v-img>
                    </v-card-text>
                    <div
                        style="width: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 4px 0 8px 0;">

                        <div>
                            <div style="display: flex; gap: 6px; padding-bottom: 6px; align-items: center;">
                                <v-icon style="color: #A29cfe;">mdi-check</v-icon>
                                <h4>{{ book.category }}</h4>
                            </div>
                            <p
                                style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
                                {{ book.title }}</p>
                            <h3>{{ book.authors.join(", ") || '작가 정보 없음' }}</h3>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; flex-direction: row; gap: 16px;">
                                <h4 style="padding-right: 12px; box-shadow: 5px 0 0 -3px #999;">발행연도 : {{
                                    formatDate(book?.datetime) || '정보 없음' }}</h4>
                                <h4>출판사 : {{ book?.publisher || '정보 없음' }}</h4>
                            </div>
                            <h4>ISBN: {{ book?.isbn }}</h4>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else-if="searchQuery" class="saveBookBox">
            <v-col style="display:flex; justify-content: center; padding: 40px;">
                <h3>검색 결과가 없습니다.</h3>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import SavedBookDetailModal from './SavedBookDetailModal.vue';

const searchQuery = ref('');
const bookStore = useBookStore();

const filteredBooks = ref([]);

watch(searchQuery, () => {
    searchBooks();
});

const searchBooks = () => {
    if (!searchQuery.value.trim()) {
        filteredBooks.value = [];
        return;
    }
    const lowerSearchQuery = searchQuery.value.toLowerCase();
    filteredBooks.value = bookStore.books.all.filter(book => {
        return (
            book.title.toLowerCase().includes(lowerSearchQuery) ||
            (Array.isArray(book.authors) && book.authors.some(author => author.toLowerCase().includes(lowerSearchQuery)))
        );
    });
};

const openBookDetail = (book) => {
    bookStore.selectSavedBook(book, book.category);
};

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

.saveBookBox {
    margin: 5px 0 40px 0 !important;
    padding-bottom: 40px;
    border-bottom: 5px solid #f6f6f6;
}
</style>