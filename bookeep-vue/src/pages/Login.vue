<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title class="headline">로그인</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="login">
                            <v-text-field v-model="email" label="Email" required></v-text-field>
                            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                            <v-btn type="submit" color="primary">로그인</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';

const email = ref('');
const password = ref('');
const bookStore = useBookStore();
const router = useRouter();

const login = async () => {
    const { user, error } = await supabase.auth.signIn({ email: email.value, password: password.value });
    if (error) {
        alert('로그인 실패: ' + error.message);
    } else {
        bookStore.setUser(user);
        router.push('/');
    }
};
</script>