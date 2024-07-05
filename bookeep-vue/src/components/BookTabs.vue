<template>
    <v-container>
        <div class="tabs">
            <v-tabs v-model="activeTab" show-arrows color="deep-purple-lighten-2">
                <v-tab v-for="(category, index) in categories" :key="index">{{ category }}</v-tab>
            </v-tabs>
            <p>{{ activeCategoryBookCount }}권의 책 저장중</p>
        </div>
        <v-tabs-items v-model="activeTab">
            <v-tab-item>
                <BookList :category="categories[activeTab]" />
            </v-tab-item>
        </v-tabs-items>
    </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BookList from './BookList.vue';

const activeTab = ref(0);
const categories = ['읽고 싶은 책', '읽는 중인 책', '다 읽은 책'];

const getBookCounts = () => {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
        wantToRead: [],
        reading: [],
        finished: []
    };

    return {
        '읽고 싶은 책': savedBooks.wantToRead.length,
        '읽는 중인 책': savedBooks.reading.length,
        '다 읽은 책': savedBooks.finished.length
    };
};

const bookCounts = ref(getBookCounts());

const activeCategoryBookCount = computed(() => {
    const category = categories[activeTab.value];
    return bookCounts.value[category];
});

watch(activeTab, () => {
    bookCounts.value = getBookCounts();
});
</script>
<style scoped>
.tabs {
    display: flex;
    justify-content: space-between;
}
</style>