<template>
    <v-container class="searchBox">
        <v-text-field v-model="searchQuery" label="책 이름 또는 저자명으로 검색" dense clearable @input="searchBooks"></v-text-field>
        <v-row v-if="filteredBooks.length">
            <v-col xs="12" sm="6" md="4" lg="3" v-for="book in filteredBooks" :key="book.id">
                <v-card @click="openBookDetail(book)">
                    <v-img :src="book.thumbnail" aspect-ratio="1"></v-img>
                    <v-card-text>
                        <p>{{ book.title }}</p>
                        <p>{{ Array.isArray(book.authors) ? book.authors.join(", ") : '작가 정보 없음' }}</p>
                        <p>{{ book.category }}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else-if="searchQuery">
            <v-col>
                <p>검색 결과가 없습니다.</p>
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
</script>

<style scoped>
.searchBox {
    padding: 0;
}
</style>