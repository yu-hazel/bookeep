<template>
    <v-navigation-drawer app permanent style="width: 240px;">
        <!-- parmanent 속성으로 항상 내비게이션 바 고정 -->
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="headline">Bookeep</v-list-item-title>
                    <v-img :src="profileImg" alt="Profile Image" max-width="100" class="profileImg" />
                    <div class="userSubTitle">
                        <div v-if="isLoggedIn" class="userName">
                            <span>안녕하세요, </span>
                            <span>{{ userName }}님!</span>
                        </div>
                        <div v-else>
                            <span>로그인 해주세요</span>
                        </div>
                        <p v-if="isLoggedIn">행복을 읽는 유저</p>
                    </div>
                </v-list-item-content>
            </v-list-item>

            <!-- <v-divider></v-divider> -->

            <v-list-item link style="padding: 0;">
                <router-link to="/">
                    <v-list-item-title>나의 책장</v-list-item-title>
                </router-link>
            </v-list-item>

            <v-list-item link style="padding: 0;">
                <router-link to="/ReadingStatistics">
                    <v-list-item-title>나의 독서통계</v-list-item-title>
                </router-link>
            </v-list-item>

            <v-list-item link style="padding: 0;">
                <router-link to="/SearchBooks">
                    <v-list-item-title class="navMenu">검색하기</v-list-item-title>
                </router-link>
            </v-list-item>

            <v-list-item link @click="isLoggedIn ? signOut() : signIn()" style="padding: 0;">
                <v-list-item-title>{{ isLoggedIn ? '로그아웃' : '로그인' }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { useUserStore } from '@/stores/userStore';
import { useBookStore } from '@/stores/bookStore';
import profileImgPath from '@/assets/profile_img.png';

const profileImg = ref(profileImgPath);
const isLoggedIn = ref(false);

const userStore = useUserStore();
const bookStore = useBookStore();
const userName = computed(() => userStore.userName);

const supabaseUrl = 'https://vovzpunshmcodmkletaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdnpwdW5zaG1jb2Rta2xldGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMDg5MzUsImV4cCI6MjAzMzY4NDkzNX0.aVXi_AbLx-AGNwWVa0MB-WiNrkht2Eq0ECnBwDds2Kc';
const supabase = createClient(supabaseUrl, supabaseKey);

const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: window.location.origin,
            // redirectTo: 'https://yu-hazel.github.io/bookeep/', // ❗️배포용! 빌드할때 이걸로 설정해야함
        },
    });
    if (error) console.error('Error: ', error.message);
};

const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error: ', error.message);
    isLoggedIn.value = false;
    userStore.setUserName('회원명');
    bookStore.setUser(null);
    location.reload(); // 로그아웃 후 페이지 새로고침
};

const checkLoginStatus = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    isLoggedIn.value = !!session;
    if (session) {
        const { user } = session;
        userStore.setUserName(user.user_metadata.user_name || user.email);
        bookStore.setUser(user);
    }
};

onMounted(() => {
    checkLoginStatus();
});

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
/* .userSubTitle p:first-of-type {
    font-size: 20px;
} */
.v-list-item-title.headline {
    font-size: 24px;
    font-weight: 700;
}
.userName {
    font-size: 20px;
    text-align: center;
}
.v-list-item {
    padding: 0;
}
.navMenu {
    color: red;
    height: 100%;
}
</style>