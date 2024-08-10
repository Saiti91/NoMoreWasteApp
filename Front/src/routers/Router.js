import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../vue/LoginPage.vue';
import useAuthGuard from '../components/Auth/AuthGuard.js';

//***** FRONT OFFICE
import SignUpPage from "../vue/frontOffice/SignUpPage.vue";
import Home from "../vue/frontOffice/Home.vue";
import CatalogueProduct from "@/vue/frontOffice/Don/CatalogueProduct.vue";
import Donation from "@/vue/frontOffice/Recevoir/Donation.vue";
import MyAccount from "@/vue/frontOffice/Compte/MyAccount.vue";

//***** BACK OFFICE
import BackOfficeHome from '../vue/backOffice/Home.vue';
import UsersAdmin from '../vue/backOffice/Users/UserAdmin.vue';
import UserDetails from '@/vue/backOffice/Users/UserDetails.vue';
import StocksAdmin from '@/vue/backOffice/Stocks/StocksAdmin.vue';
import StocksDetails from '@/vue/backOffice/Stocks/StocksDetails.vue';
import DonationAdmin from '@/vue/backOffice/Don/DonationsAdmin.vue';
import DonationDetails from '@/vue/backOffice/Don/DonationsDetails.vue';
import TourAdmin from "@/vue/backOffice/Tournee/TourAdmin.vue";
import TourDetails from "@/vue/backOffice/Tournee/TourDetails.vue";




const routes = [
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/', name: 'Home', component: Home },

    //***** FRONT OFFICE
    { path: '/sign-up', name: 'SignUp', component: SignUpPage },
    {
        path: '/catalogue',
        name: 'Catalogue',
        component: CatalogueProduct,
        //beforeEnter: useAuthGuard(['client'])
    },
    {
        path: '/donation',
        name: 'Donation',
        component: Donation,
        //beforeEnter: useAuthGuard(['client'])
    },
    {
        path: '/my-account',
        name: 'MyAccount',
        component: MyAccount,
        //beforeEnter: useAuthGuard(['client'])
    },

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
    },
    {
        path: '/stocks-admin',
        name: 'StocksAdmin',
        component: StocksAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/stocks-admin/:id',
        name: 'StocksDetails',
        component: StocksDetails,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/donation-admin',
        name: 'DonationAdmin',
        component: DonationAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/donation-admin/:id',
        name: 'DonationDetails',
        component: DonationDetails,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/tour-admin',
        name: 'TourAdmin',
        component: TourAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/tour-admin/:id',
        name: 'TourDetails',
        component: TourDetails,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
