<template>
    <div class="main01" style="width: 100%; max-width: 2000px;">
        <!-- <div style="display: flex; gap: 8px; padding: 8px;">
            <v-icon>mdi-magnify</v-icon>
            <h3>검색하기</h3>
        </div> -->
        <SearchBook class="SearchBook" />
    </div>
</template>

<script setup>
import SearchBook from '../components/SearchBook.vue';
</script>

<style scoped>
.main01 {
    width: 100%;
    max-width: 2000px;
    padding: 35px 5%;
    display: flex;
    flex-direction: column;
    gap: 30px;
}
.SearchBook {
    max-width: 2000px;
    padding: 0;
}
</style>

