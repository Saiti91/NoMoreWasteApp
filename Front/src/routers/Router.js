// src/routers/Router.js
import {createRouter, createWebHistory} from 'vue-router';

import LoginPage from '../vue/LoginPage.vue';
import useAuthGuard from '../components/Auth/AuthGuard.js';

//***** FRONT OFFICE
import SignUpPage from "../vue/frontOffice/SignUpPage.vue";


//***** BACK OFFICE
import BackOfficeHome from '../vue/backOffice/Home.vue';


const routes = [

    {path: '/login', name: 'Login', component: LoginPage},


    //***** FRONT OFFICE
    {path: '/sign-up', name: 'SignUp', component: SignUpPage},

    //***** BACK OFFICE
    {
        path: '/',
        name: 'BackOfficeHome',
        component: BackOfficeHome,
        beforeEnter: useAuthGuard(['admin'])},


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
