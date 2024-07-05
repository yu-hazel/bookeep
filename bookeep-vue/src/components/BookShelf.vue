<template>
    <div class="bookshelf">
        <div v-for="(book, index) in finishedBooks" :key="book.isbn" class="book"
            :style="getBookStyle(book, index, fibSequence)">
            <span class="book-title">{{ book.title }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
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
const finishedBooks = computed(() =>
    JSON.parse(localStorage.getItem('savedBooks'))?.finished || []
);

// 피보나치 수열 생성
const fibSequence = generateFibonacciSequence(finishedBooks.value.length);

// 책 스타일 계산 함수 정의
const getBookStyle = (book, index, fibSequence) => {
    const minPageWidth = 30; // 최소 너비
    const maxPageWidth = 80; // 최대 너비

    const bookWidth = minPageWidth + ((book.pages / 1000) * (maxPageWidth - minPageWidth));
    const minHeight = 150; // 최소 높이
    const maxHeight = 200; // 최대 높이

    const bookHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

    // 기울임 각도 설정
    const tilt = fibSequence.includes(index + 1) ? Math.random() * 10 - 5 : 0;

    return {
        width: `${bookWidth}px`,
        height: `${bookHeight}px`,
        // backgroundColor: '#F2F2F5',
        transform: `rotate(${tilt}deg)`,
    };
};
</script>

<style scoped>
.bookshelf {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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
    /* border: 1px solid #000; */
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
}
.book:hover {
    background-color: #A29CFE;
}
.book-title {
    font-size: 12px;
    color: #71707A;
}
</style>