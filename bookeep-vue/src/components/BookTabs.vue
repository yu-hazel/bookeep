<template>
    <v-container class="myBook">
        <div class="tabs">
            <v-tabs v-model="activeTab" show-arrows color="deep-purple-lighten-2" class="menuBox">
                <v-tab v-for="(category, index) in categories" :key="index" class="menu">
                    <h3>{{ category }}</h3>
                </v-tab>
            </v-tabs>
            <h3>{{ activeCategoryBookCount }}권의 책 저장중</h3>
        </div>
        <v-tabs-items v-model="activeTab">
            <v-tab-item>
                <SearchSavedBook />
            </v-tab-item>
            <v-tab-item>
                <BookList :category="categories[activeTab]" />
            </v-tab-item>
        </v-tabs-items>
    </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import BookList from './BookList.vue';
import SearchSavedBook from './SearchSavedBook.vue';
import { useBookStore } from '@/stores/bookStore';

const bookStore = useBookStore();

const activeTab = ref(0);
const categories = ['다 읽은 책', '읽는 중인 책', '읽고 싶은 책'];

const bookCounts = computed(() => {
    const books = bookStore.books;
    return {
        '읽고 싶은 책': books?.wantToRead?.length || 0,
        '읽는 중인 책': books?.reading?.length || 0,
        '다 읽은 책': books?.finished?.length || 0
    };
});

const activeCategoryBookCount = computed(() => {
    const category = categories[activeTab.value];
    return bookCounts.value[category];
});

onMounted(() => {
    bookStore.loadBooks();
});

watch(activeTab, () => {
    bookStore.loadBooks();
});
</script>

<style scoped>
.tabs {
    padding: 0 0.5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.myBook {
    padding: 0;
    max-width: 2000px;
    gap: 18px;
    display: flex;
    flex-direction: column;
}
.menu {
    font-size: 16px;
    padding: 0 5px;
}
:deep(.v-slide-group__content) {
    gap: 12px;
}
</style>