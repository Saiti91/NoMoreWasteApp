import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../vue/LoginPage.vue';
import useAuthGuard from '../components/Auth/AuthGuard.js';

//***** FRONT OFFICE
import SignUpPage from "../vue/frontOffice/SignUpPage.vue";
import Home from "../vue/frontOffice/Home.vue";
import CatalogueProduct from "@/vue/frontOffice/Recevoir/CatalogueProduct.vue";
import Donation from "@/vue/frontOffice/Don/Donation.vue";
import MyAccount from "@/vue/frontOffice/Compte/MyAccount.vue";
import CreateTicket from "@/vue/frontOffice/Tickets/CreateTicket.vue";
import Test from "@/vue/frontOffice/test.vue";
import JoinUs from "@/vue/frontOffice/Join/JoinUs.vue";

//***** BACK OFFICE
import BackOfficeHome from '../vue/backOffice/Home.vue';
import Categories from "@/vue/backOffice/Categorie/categories.vue";

//***** Users
import UsersAdmin from '../vue/backOffice/Users/UserAdmin.vue';
import UserDetails from '@/vue/backOffice/Users/UserDetails.vue';
import UserDetailsDonations from "@/vue/backOffice/Users/UserDetailsDonations.vue";
import UserDetailsRecievedProduct from "@/vue/backOffice/Users/UserDetailsRecievedProduct.vue";

//***** Stocks
import StocksAdmin from '@/vue/backOffice/Stocks/StocksAdmin.vue';
import StocksDetails from '@/vue/backOffice/Stocks/StocksDetails.vue';

//***** Donations
import DonationAdmin from '@/vue/backOffice/Don/DonationsAdmin.vue';
import DonationDetails from '@/vue/backOffice/Don/DonationsDetails.vue';

//***** Tounrée
import TourAdmin from "@/vue/backOffice/Tournee/TourAdmin.vue";
import TourDetails from "@/vue/backOffice/Tournee/TourDetails.vue";
import DistributionTourAdmin from "@/vue/backOffice/Tournee/DistributionTourAdmin.vue";
import PickupTourAdmin from "@/vue/backOffice/Tournee/PickUpTourAdmin.vue";




const routes = [
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/', name: 'Home', component: Home },

    //***** FRONT OFFICE
    { path: '/sign-up', name: 'SignUp', component: SignUpPage },
    { path: '/create-ticket', name: 'CreateTicket', component: CreateTicket },
    { path: '/join-us', name: 'JoinUs', component: JoinUs },
    { path: '/test', name: 'Test', component: Test },
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
    //TODO: Ajouter les routes pour les détails des services coté admin
    // {
    //     path: '/user-services-proposed/:id',
    //     name: 'TourDetails',
    //     component: TourDetails,
    //     /*beforeEnter: useAuthGuard(['admin'])*/
    // },
    // {
    //     path: '/user-services-participated/:id',
    //     name: 'TourDetails',
    //     component: TourDetails,
    //     /*beforeEnter: useAuthGuard(['admin'])*/
    // },
    {
        path: '/user-donations/:id',
        name: 'UserDetailsDonations',
        component: UserDetailsDonations,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/user-products-received/:id',
        name: 'UserDetailsRecievedProduct',
        component: UserDetailsRecievedProduct,
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
        path: '/distribution-tours',
        name: 'DistributionTourAdmin',
        component: DistributionTourAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/pickup-tours',
        name: 'PickupTourAdmin',
        component: PickupTourAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/tour-admin/:id',
        name: 'TourDetails',
        component: TourDetails,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },

    { path: '/categories', name: 'Categories', component: Categories },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
