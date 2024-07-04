<template>
    <v-dialog v-model="showSavedBookModal" max-width="500">
        <v-card>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-icon @click="closeSavedBookModal" size="x-small">mdi-close</v-icon>
            </v-card-title>
            <v-card-text class="bookDetailWrapper">
                <v-img :src="selectedSavedBook?.thumbnail" class="bookDetailImage" aspect-ratio="1.5"></v-img>
                <div>
                    <span>{{ selectedSavedBook?.title }}</span>
                    <p>{{ selectedSavedBook?.authors?.join(", ") || '작가 정보 없음' }}</p>
                    <p><span>ISBN:</span> {{ selectedSavedBook?.isbn }}</p>
                    <p>페이지 수: {{ selectedSavedBook?.pages }}</p>
                    <p>코멘트: {{ selectedSavedBook?.comment }}</p>
                    <v-rating :model-value="selectedSavedBook?.rating" background-color="yellow" color="yellow darken-2"
                        dense length="5" half-increments readonly></v-rating>
                    <p v-if="selectedSavedBookCategory === '읽는 중인 책' || selectedSavedBookCategory === '다 읽은 책'">
                        독서 시작일 : {{ selectedSavedBook?.startDate }}
                    </p>
                    <p v-if="selectedSavedBookCategory === '다 읽은 책'">
                        독서 종료일 : {{ selectedSavedBook?.endDate }}
                    </p>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useBookStore } from '@/stores/bookStore';

const bookStore = useBookStore();

const selectedSavedBook = computed(() => bookStore.selectedSavedBook);
const showSavedBookModal = computed(() => bookStore.showSavedBookModal);
const selectedSavedBookCategory = computed(() => bookStore.selectedSavedBookCategory);

const closeSavedBookModal = () => {
    bookStore.closeSavedBookModal();
};
</script>

<style scoped>
.v-card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.bookDetailWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
}

.bookDetailImage {
    height: 200px;
    width: 150px;
    margin-bottom: 16px;
}
</style>