<template>
    <v-container>
        <v-tabs v-model="activeTab" show-arrows>
            <v-tab v-for="(category, index) in categories" :key="index">{{ category }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
            <v-tab-item>
                <BookList :category="categories[activeTab]" />
            </v-tab-item>
        </v-tabs-items>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import BookList from './BookList.vue';

const activeTab = ref(0);
const categories = ['읽고 싶은 책', '읽는 중인 책', '다 읽은 책'];
</script>