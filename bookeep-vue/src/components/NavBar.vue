<template>
    <v-app-bar app v-if="!isPermanent">
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
        <!-- <v-toolbar-title>Bookeep</v-toolbar-title> -->
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app temporary :permanent="isPermanent" :temporary="!isPermanent"
        style="width: 240px; box-shadow: 0 4px 20px #eee; border: none;">
        <!-- parmanent 속성으로 항상 내비게이션 바 고정 -->
        <v-list class="h-100 d-flex flex-column" style="padding: 40px 0; gap: 48px;">
            <v-list-item style="padding: 0 32px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Bookeep</v-list-item-title>
                    <div class="w-100 d-flex flex-column profile">
                        <v-img :src="profileImg" alt="Profile Image" max-width="100" class="profileImg"
                            @click="signIn" />
                        <div class="userSubTitle">
                            <div v-if="isLoggedIn" class="userName">
                                <p>안녕하세요, </p>
                                <p>{{ userName }}님 !</p>
                            </div>
                            <div v-else>
                                <h1>로그인 해주세요</h1>
                            </div>
                            <h4 v-if="isLoggedIn">행복을 읽는 유저</h4>
                        </div>
                    </div>
                </v-list-item-content>
            </v-list-item>

            <!-- <v-divider></v-divider> -->
            <div class="navMenuBox">
                <div class="navMenu">
                    <router-link to="/" class="v-list-item" custom v-if="isLoggedIn">
                        <template v-slot="{ navigate, href, isActive, isExactActive }">
                            <v-list-item :href="href" @click="navigate"
                                :class="{ 'router-link-active': isActive, 'router-link-exact-active': isExactActive }"
                                style="padding: 0;">
                                <v-list-item-title>
                                    <div class="d-flex menu"><v-icon>mdi-home</v-icon>
                                        <h3>나의 책장</h3>
                                    </div>
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                    </router-link>
                    <router-link to="/ReadingStatistics" class="v-list-item" custom v-if="isLoggedIn">
                        <template v-slot="{ navigate, href, isActive, isExactActive }">
                            <v-list-item :href="href" @click="navigate"
                                :class="{ 'router-link-active': isActive, 'router-link-exact-active': isExactActive }"
                                style="padding: 0;">
                                <v-list-item-title>
                                    <div class="d-flex menu"><v-icon>mdi-chart-bar</v-icon>
                                        <h3>나의 독서통계</h3>
                                    </div>
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                    </router-link>
                    <router-link to="/SearchBooks" class="v-list-item" custom>
                        <template v-slot="{ navigate, href, isActive, isExactActive }">
                            <v-list-item :href="href" @click="navigate"
                                :class="{ 'router-link-active': isActive, 'router-link-exact-active': isExactActive }"
                                style="padding: 0;">
                                <v-list-item-title>
                                    <div class="d-flex menu"> <v-icon>mdi-magnify</v-icon>
                                        <h3>검색하기</h3>
                                    </div>
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                    </router-link>
                </div>

                <v-btn link @click="isLoggedIn ? signOut() : signIn()" style="padding: 0; height: 48px;"
                    class="text-none logBt" variant="text" border>
                    <v-list-item-title style="text-align: center;">
                        <h3>{{ isLoggedIn ? '로그아웃' : '로그인' }}</h3>
                    </v-list-item-title>
                </v-btn>
            </div>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { useUserStore } from '@/stores/userStore';
import { useBookStore } from '@/stores/bookStore';
import profileImgPath from '@/assets/profile_img.png';

const drawer = ref(false);
const windowWidth = ref(window.innerWidth);

const isPermanent = computed(() => windowWidth.value >= 960);

const toggleDrawer = () => {
    drawer.value = !drawer.value;
};

const handleResize = () => {
    windowWidth.value = window.innerWidth;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    if (isPermanent) {
        drawer.value = true;
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

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
            // redirectTo: 'https://bookeep-beta.vercel.app/', // vercel 배포 도메인
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

<style scoped>
h1 {
    font-size: 20px;
    font-weight: 500;
}
h3 {
    letter-spacing: -0.025em;
}
.v-list-item {
    padding: 0;
}
v-list-item-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
}
.profile {
    align-items: center;
    gap: 18px;
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
    gap: 8px;
}
/* .userSubTitle p:first-of-type {
    font-size: 20px;
} */
.v-list-item-title.headline {
    font-size: 24px;
    font-weight: 700;
}
.userName {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.v-list-item {
    padding: 0;
}
.v-list-item__content {
    height: 100%;
}
a {
    text-decoration-line: none;
    width: 100%;

}
.navMenu .v-list-item-title {
    padding: 20px;
}
.v-list-item-title.headline {
    font-size: 24px;
    font-weight: 700;
}
.router-link-active .v-list-item-title,
.router-link-exact-active .v-list-item-title {
    font-weight: bold;
    color: #6200EA;
    border-left: 4px solid #6200EA;
    background: #f9f8ff;
}
.navMenuBox {
    display: flex;
    align-content: space-between;
    flex-flow: row wrap;
    height: 100%;
    justify-content: center;
}
.navMenu {
    width: 100%;
}
.menu {
    gap: 8px;
}
.logBt {
    border-radius: 50px;
    width: 130px;
}
</style>