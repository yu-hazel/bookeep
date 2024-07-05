<template>
    <v-navigation-drawer app permanent>
        <!-- parmanent 속성으로 항상 내비게이션 바 고정 -->
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="headline">Bookeep</v-list-item-title>
                    <v-img :src="profileImg" alt="Profile Image" max-width="100" class="profileImg" />
                    <div class="userSubTitle">
                        <p>안녕하세요, {{ userName }}님!</p>
                        <p>행복을 읽는 유저</p>
                    </div>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item link>
                <router-link to="/">
                    <v-list-item-title>나의 책장</v-list-item-title>
                </router-link>
            </v-list-item>

            <v-list-item link>
                <router-link to="/ReadingStatistics">
                    <v-list-item-title>나의 독서통계</v-list-item-title>
                </router-link>
            </v-list-item>

            <v-list-item link>
                <router-link to="/SearchBooks">
                    <v-list-item-title>검색하기</v-list-item-title>
                </router-link>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';
import profileImg from '../assets/profile_img.png';

const userName = ref('유혜인');
const profileImgSrc = ref(profileImg);
</script>

<!-- <script>
export default {
    name: 'NavBar',
    data() {
        return {
            userName: '유혜인',
        }
    }
};
</script> -->

<style>
v-list-item-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    padding: 10px 0;
}
.profileImg {
    width: 100px;
    height: 100px;
}
.userSubTitle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
}
.userSubTitle p:first-of-type {
    font-size: 20px;
}
.v-list-item-title.headline {
    font-size: 24px;
    font-weight: 700;
}
</style>