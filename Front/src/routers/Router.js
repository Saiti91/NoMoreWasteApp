// src/routers/Router.js
import {createRouter, createWebHistory} from 'vue-router';
/*
import LoginPage from '/src/vues/LoginPage.vue';
import useAuthGuard from '/src/components/Auth/AuthGuard.js';
*/


const routes = [
    /*
    {path: '/login', name: 'Login', component: LoginPage},


    {   path: '/join-housing',
        name: 'Join-Housing',
        component: JoinHousingPage,
        beforeEnter: useAuthGuard(['admin', 'staff', 'customer', 'owner'])
    },
    */



];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
