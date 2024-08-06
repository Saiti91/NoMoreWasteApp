import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../vue/LoginPage.vue';
import useAuthGuard from '../components/Auth/AuthGuard.js';

//***** FRONT OFFICE
import SignUpPage from "../vue/frontOffice/SignUpPage.vue";
import Home from "../vue/frontOffice/Home.vue";

//***** BACK OFFICE
import BackOfficeHome from '../vue/backOffice/Home.vue';
import UsersAdmin from '../vue/backOffice/Users/UserAdmin.vue';
import UserDetails from '@/vue/backOffice/Users/UserDetails.vue';

const routes = [
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/', name: 'Home', component: Home },

    //***** FRONT OFFICE
    { path: '/sign-up', name: 'SignUp', component: SignUpPage },

    //***** BACK OFFICE
    {
        path: '/back-office',
        name: 'BackOfficeHome',
        component: BackOfficeHome,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/users',
        name: 'UsersAdmin',
        component: UsersAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/users/:id',
        name: 'UserDetails',
        component: UserDetails,
        /*beforeEnter: useAuthGuard(['admin'])*/
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
