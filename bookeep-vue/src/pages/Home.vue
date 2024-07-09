<template>
    <div class="main01">
        <!-- <h1>나의 책장 페이지</h1> -->
        <div>
            <h1><span class="userName">{{ userName }}</span>님,</h1>
            <h2><span class="brandName">Bookeep</span>과 함께 한 권의 책이 열어주는</h2>
        </div>
        <h2>새로운 세상을 만나 보세요.</h2>
        <BookShelf />
        <BookTabs class="BookTa" />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useBookStore } from '@/stores/bookStore';
import BookShelf from '@/components/BookShelf.vue';
import BookTabs from '@/components/BookTabs.vue';

const userStore = useUserStore();
const bookStore = useBookStore();
const userName = computed(() => userStore.userName);
const books = computed(() => bookStore.books);

onMounted(() => {
    bookStore.loadBooks();
});
</script>

<!-- <script>
export default {
    name: 'Home',
    data() {
        return {
            userName : '유혜인',
        }
    }
};
</script> -->

<style>
.userName {
    /* color: #A29CFE; */
    font-weight: 600;
    font-size: 42px;
}
.brandName {
    color: #A29CFE;
    font-size: 34px;
}
.main01 {
    padding: 0 5%;
}
</style>