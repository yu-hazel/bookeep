<template>
    <div>
        <h1>나의 책장 페이지</h1>
        <p>
            <span class="userName">{{ userName }}</span>님, Bookeep과 함께 한 권의 책이 열어주는
        </p>
        <p>새로운 세상을 만나 보세요.</p>
        <BookShelf />
        <BookTabs />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BookTabs from '../components/BookTabs.vue';
import BookShelf from '../components/BookShelf.vue';

const userName = ref('유혜인');
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
    color: #A29CFE;
    font-weight: 600;
}
</style>