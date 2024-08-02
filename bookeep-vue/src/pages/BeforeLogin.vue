<template>
    <div
        style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 80px; padding-bottom: 200px;">
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
            <h1 style="letter-spacing: 0; color: #a29cfe; font-size: 26px;">Bookeep</h1>
            <div style="display: flex; flex-direction: column; gap: 6px; align-items: center;">
                <h2 style="font-weight: 600; font-size: 28px;">로그인 후 이용이 가능합니다.</h2>
                <h3 style=" color: #999; font-weight: 400;">Github로 로그인하고 독서기록 시작해보세요 !</h3>
            </div>
        </div>
        <!-- <img src="../assets/github_logo.png"> -->
        <button @click="signInWithGithub" class="signGithub">
            <v-icon style="font-size: 24px;">mdi-github</v-icon>
            로그인
        </button>
    </div>
</template>

<script setup>
import { supabase } from '@/supabase';

const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            // redirectTo: window.location.origin,
            redirectTo: 'https://bookeep.vercel.app', // vercel 배포 도메인
            // redirectTo: 'https://yu-hazel.github.io/bookeep/', // github.io❗️배포용! 빌드할때 이걸로 설정해야함
        },
    });
    if (error) console.error('Error: ', error.message);
};
</script>

<style scoped>
.signGithub {
    box-shadow: none;
    height: 50px;
    border-radius: 50px;
    width: 200px;
    background-color: #A29cfe;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;
    font-weight: 500;
    /* box-shadow: 0 4px 10px 0 #f1f0ff; */
}
.signGithub:hover {
    background-color: #b4aeff;
    color: #fff;
    font-weight: 500;
}
</style>