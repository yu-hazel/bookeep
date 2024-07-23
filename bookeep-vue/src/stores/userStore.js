import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        userName: '북킵', // 기본값
    }),
    actions: {
        setUserName(name) {
            this.userName = name;
        },
    },
});