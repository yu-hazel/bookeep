<template>
    <div>
        <h1>로그인해주세요</h1>
        <v-btn @click="signInWithGithub">깃허브로 로그인</v-btn>
    </div>
</template>

<script setup>
import { supabase } from '@/supabase';

const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: window.location.origin,
            // redirectTo: 'https://yu-hazel.github.io/bookeep/', // ❗️배포용! 빌드할때 이걸로 설정해야함
        },
    });
    if (error) console.error('Error: ', error.message);
};
</script>

<style scoped>
</style>