<template>
    <div class="main01">
        <!-- <h1>나의 책장 페이지</h1> -->
        <div class="txtBox">
            <div style="display: flex; gap: 8px;">
                <v-icon>mdi-home</v-icon>
                <h3>나의 책장</h3>
            </div>
            <div class="title">
                <h1><span class="userName">{{ userName }}</span>님,</h1>
                <div class="subTitle">
                    <h2 class="brandName">Bookeep</h2>
                    <h2 style="padding-right: 6px;">과 함께 한 권의 책이 열어주는</h2>
                    <h2>새로운 세상을 만나 보세요.
                    </h2>
                </div>
            </div>
        </div>

        <div class="contentBox">
            <BookShelf v-if="isLoggedIn" class="BookShelf" />
            <BookTabs class="BookTabs" />
        </div>
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
const isLoggedIn = computed(() => bookStore.isLoggedIn);

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

<style scoped>
.userName {
    /* color: #A29CFE; */
    font-weight: 600;
    font-size: 42px;
}
.brandName {
    color: #A29CFE;
    font-size: 34px;
    font-weight: 600;
}
.main01 {
    width: 100%;
    max-width: 2000px;
    padding: 40px 5%;
    display: flex;
    flex-direction: column;
    gap: 40px;
}
.txtBox {
    padding: 0 0.5%;
    display: flex;
    flex-direction: column;
    gap: 18px;
}
.title {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.subTitle {
    display: flex;
    flex-wrap: wrap;
}
/* .BookShelf {
    padding: 50px 20px 40px 20px;
    border: 1px solid #DCDCE1;
    border-radius: 30px;
} */
.contentBox {
    display: flex;
    flex-direction: column;
    gap: 28px;
}
</style>