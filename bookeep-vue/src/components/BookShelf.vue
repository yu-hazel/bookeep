<template>
    <div class="bookShelfBox">
        <div class="bookshelf">
            <div class="books">
                <div v-for="(book, index) in finishedBooks" :key="book.isbn" class="book" :style="bookStyles[book.isbn]">
                    <span class="book-title">{{ book.title }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, onMounted, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore';

// 피보나치 수열 생성 함수 정의
const generateFibonacciSequence = (max) => {
    const fib = [1, 1];
    while (true) {
        const next = fib[fib.length - 1] + fib[fib.length - 2];
        if (next > max) break;
        fib.push(next);
    }
    return fib;
};

// 책 저장소 불러오기
const bookStore = useBookStore();

// 다 읽은 책 목록 가져오기
const finishedBooks = computed(() => bookStore.books.finished || []);

// 피보나치 수열 생성
const fibSequence = reactive([]);

// 책 스타일 상태 저장
const bookStyles = reactive({});

// 책 스타일 계산 함수 정의
const getBookStyle = (book, index, fibSequence) => {
    const minPageWidth = 30; // 최소 너비
    const maxPageWidth = 80; // 최대 너비

    let bookWidth = minPageWidth + ((book.pages / 1000) * (maxPageWidth - minPageWidth));
    bookWidth = Math.min(bookWidth, maxPageWidth);

    const minHeight = 150; // 최소 높이
    const maxHeight = 200; // 최대 높이

    const bookHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

    // 기울임 각도 설정
    // const tilt = fibSequence.includes(index + 1) ? Math.random() * 10 - 5 : 0;

    return {
        width: `${bookWidth}px`,
        height: `${bookHeight}px`,
        backgroundColor: '#F2F2F5',
        // transform: `rotate(${tilt}deg)`,
        transformOrigin: 'bottom'
    };
};

const updateBookStyles = () => {
    fibSequence.splice(0, fibSequence.length, ...generateFibonacciSequence(finishedBooks.value.length));
    finishedBooks.value.forEach((book, index) => {
        if (!bookStyles[book.isbn]) {
            bookStyles[book.isbn] = getBookStyle(book, index, fibSequence);
        }
    });
};

onMounted(() => {
    bookStore.loadBooks();
    updateBookStyles();
});

watch(finishedBooks, () => {
    updateBookStyles();
});
</script>

<style scoped>
.bookShelfBox {
    padding: 34px 20px 18px 20px;
    border: 1px solid #DCDCE1;
    border-radius: 30px;
}
.bookshelf {
    display: flex;
    flex-wrap: nowrap;

    align-items: flex-end;
    /* overflow-x: scroll; */
    overflow: auto;
}
.bookshelf::-webkit-scrollbar {
    bottom: 10px;
    height: 8px;
}
.bookshelf::-webkit-scrollbar-thumb {
    background: #eee;
    border-radius: 10px;
}
.books {
    padding: 20px 5px 18px 5px;
    gap: 8px;
    display: flex;
    align-items: flex-end;
}

.book {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 5px;
    color: white;
    background-color: #F2F2F5;
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
}

.book:hover {
    background-color: #A29CFE !important;
}

.book:hover .book-title {
    color: #fff;
}

.book-title {
    font-size: 12px;
    color: #71707A;
}
</style>