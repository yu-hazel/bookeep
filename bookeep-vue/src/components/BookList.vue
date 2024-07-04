<template>
    <v-container>
        <v-row v-if="books.length">
            <v-col xs="12" sm="6" md="4" lg="3" v-for="book in books" :key="book.isbn">
                <v-card @click="openBookDetail(book, props.category)">
                    <v-img :src="book.thumbnail" aspect-ratio="1"></v-img>
                    <!-- <v-card-title>{{ book.title }}</v-card-title> -->
                    <!-- <v-card-subtitle>{{ book.authors.join(", ") }} 작가님</v-card-subtitle> -->
                    <v-card-text>
                        <!-- <p>페이지: {{ book.pages }}</p> -->
                        <!-- <p>코멘트: {{ book.comment }}</p> -->
                        <v-rating :model-value="book.rating" background-color="yellow" color="yellow darken-2" dense
                            length="5" half-increments readonly></v-rating>
                        <p>{{ book.authors.join(", ") }}</p>
                        <!-- 작가명이 영어로 되어 있는 경우, Herman Hesse 작가님.. 으로 나와서 '작가님' 은 빼기로! -->
                        <p><strong>{{ book.title }}</strong></p>
                        <p>{{ book.startDate }} | {{ book.endDate }}</p>
                        <!-- <p>종료일: {{ book.endDate }}</p> -->
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col>
                <p>저장된 책이 없습니다.</p>
            </v-col>
        </v-row>

        <SavedBookDetailModal />

    </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import SavedBookDetailModal from './SavedBookDetailModal.vue';

const bookStore = useBookStore();

const props = defineProps({
    category: {
        type: String,
        required: true
    }
});

const books = ref([]);

const loadBooks = () => {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
        wantToRead: [],
        reading: [],
        finished: []
    };

    if (props.category === '읽고 싶은 책') {
        books.value = savedBooks.wantToRead;
    } else if (props.category === '읽는 중인 책') {
        books.value = savedBooks.reading;
    } else if (props.category === '다 읽은 책') {
        books.value = savedBooks.finished;
    } else {
        books.value = [];
    }
};

const openBookDetail = (book, category) => {
    bookStore.selectSavedBook(book, category);
};

onMounted(loadBooks);
watch(() => props.category, loadBooks);
</script>