import {createRouter, createWebHistory} from 'vue-router';
import LoginPage from '../vue/LoginPage.vue';

//***** FRONT OFFICE
import SignUpPage from "../vue/frontOffice/SignUpPage.vue";
import Home from "../vue/frontOffice/Home.vue";
import CatalogueProduct from "@/vue/frontOffice/Recevoir/CatalogueProduct.vue";
import Donation from "@/vue/frontOffice/Don/Donation.vue";

import MyAccount from "@/vue/frontOffice/Compte/MyAccount.vue";
import MyAccountDonation from "@/vue/frontOffice/Compte/MyAccountDonation.vue";
import MyAccountRecievedProduct from "@/vue/frontOffice/Compte/MyAccountRecievedProduct.vue";
import MyAccountRoutes from "@/vue/frontOffice/Compte/MyAccountRoutes.vue";
import MyAccountRoutesDetails from "@/vue/frontOffice/Compte/MyAccountRoutesDetails.vue";

import CreateTicket from "@/vue/frontOffice/Tickets/CreateTicket.vue";

import JoinUs from "@/vue/frontOffice/Join/JoinUs.vue";
import PaymentCotisation from "@/vue/frontOffice/Join/PaymentCotisation.vue";
import PaymentSuccess from "@/vue/frontOffice/Join/PaymentSuccess.vue";


//***** BACK OFFICE
import BackOfficeHome from '../vue/backOffice/Home.vue';
import Categories from "@/vue/backOffice/Categorie/CategoriesAdmin.vue";

//***** Users
import UsersAdmin from '../vue/backOffice/Users/UserAdmin.vue';
import UserDetails from '@/vue/backOffice/Users/UserDetails.vue';
import UserDetailsDonations from "@/vue/backOffice/Users/UserDetailsDonations.vue";
import UserDetailsRecievedProduct from "@/vue/backOffice/Users/UserDetailsRecievedProduct.vue";
import UserDetailsRoutes from "@/vue/backOffice/Users/UserDetailsRoutes.vue";
import UserDetailsRoutesDetails from "@/vue/backOffice/Users/UserDetailsRoutesDetails.vue";

//***** Stocks
import StocksAdmin from '@/vue/backOffice/Stocks/StocksAdmin.vue';
import Stocks from "@/vue/backOffice/Stocks/Stocks.vue";
import CatalogueAdmin from "@/vue/backOffice/Stocks/Catalogue.vue";
import StocksDetails from '@/vue/backOffice/Stocks/StocksDetails.vue';

//***** Donations
import DonationAdmin from '@/vue/backOffice/Don/DonationsAdmin.vue';
import DonationsAdmin from "@/vue/backOffice/Don/DonationsDetailsAdmin.vue";
import RequestsAdmin from "@/vue/backOffice/Don/RequestDetails.vue";

//***** Tounrée
import TourAdmin from "@/vue/backOffice/Tournee/TourAdmin.vue";
import TourDetails from "@/vue/backOffice/Tournee/TourDetails.vue";
import DistributionTourAdmin from "@/vue/backOffice/Tournee/DistributionTourAdmin.vue";
import PickupTourAdmin from "@/vue/backOffice/Tournee/PickUpTourAdmin.vue";
import DonationsCreateTour from "@/vue/backOffice/Tournee/PickUpTourCreation/TourCreation.vue";
import DonationsSelectTruck from "@/vue/backOffice/Tournee/PickUpTourCreation/SelectTruck.vue";
import DonationsReviewAndConfirmTour from "@/vue/backOffice/Tournee/PickUpTourCreation/ReviewAndConfirmTour.vue";

import RequestsCreateTour from "@/vue/backOffice/Tournee/DistributionTourCreation/TourCreation.vue";
import RequestsSelectTruck from "@/vue/backOffice/Tournee/DistributionTourCreation/SelectTruck.vue";
import RequestsReviewAndConfirmTour from "@/vue/backOffice/Tournee/DistributionTourCreation/ReviewAndConfirmTour.vue";


const routes = [
    {path: '/login', name: 'Login', component: LoginPage},
    {path: '/', name: 'Home', component: Home},

    //***** FRONT OFFICE
    {path: '/sign-up', name: 'SignUp', component: SignUpPage},
    {path: '/create-ticket', name: 'CreateTicket', component: CreateTicket},
    {path: '/join-us', name: 'JoinUs', component: JoinUs},
    {
        path: '/catalogue',
        name: 'Catalogue',
        component: CatalogueProduct,
        //beforeEnter: useAuthGuard(['volunteer'])
    },
    {
        path: '/donation',
        name: 'Donation',
        component: Donation,
        //beforeEnter: useAuthGuard(['volunteer'])
    },

    //Pages de compte
    {
        path: '/my-account/:id',
        name: 'MyAccount',
        component: MyAccount,
        //beforeEnter: useAuthGuard(['volunteer'])
    },
    {
        path: '/my-account-donations/:id',
        name: 'MyAccountDonation',
        component: MyAccountDonation,
        /*beforeEnter: useAuthGuard(['volunteer'])*/
    },
    {
        path: '/my-account-products-received/:id',
        name: 'MyAccountRecievedProduct',
        component: MyAccountRecievedProduct,
        /*beforeEnter: useAuthGuard(['volunteer'])*/
    },
    {
        path: '/my-account-routes/:id',
        name: 'MyAccountRoutes',
        component: MyAccountRoutes,
        /*beforeEnter: useAuthGuard(['volunteer'])*/
    },
    {
        path: '/my-account-routes/details/:id',
        name: 'MyAccountRoutesDetails',
        component: MyAccountRoutesDetails,
        /*beforeEnter: useAuthGuard(['volunteer'])*/
    },

    //Stripe
    {
        path: '/payment-cotisation',
        name: 'PaymentCotisation',
        component: PaymentCotisation,
        //beforeEnter: useAuthGuard(['volunteer'])
    },
    {
        path: '/payment-success',
        name: 'PaymentSuccess',
        component: PaymentSuccess,
        //beforeEnter: useAuthGuard(['volunteer'])
    },

//***** BACK OFFICE
    {
        path: '/back-office',
        name: 'BackOfficeHome',
        component: BackOfficeHome,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    //Users
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
        path: '/user-routes/:id',
        name: 'UserDetailsRoutes',
        component: UserDetailsRoutes,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/user-routes/details/:id',
        name: 'UserDetailsRoutesDetails',
        component: UserDetailsRoutesDetails,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    //Stocks
    {
        path: '/stocks-admin',
        name: 'StocksAdmin',
        component: StocksAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/catalogue-admin',
        name: 'CatalogueAdmin',
        component: CatalogueAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/stocks',
        name: 'Stocks',
        component: Stocks,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/stocks-admin/:id',
        name: 'StocksDetails',
        component: StocksDetails,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    //Donations
    {
        path: '/donation-admin',
        name: 'DonationAdmin',
        component: DonationAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/donations-admin',
        name: 'DonationsAdmin',
        component: DonationsAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/requests-admin',
        name: 'RequestsAdmin',
        component: RequestsAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    //Tournée
    {
        path: '/tour-admin',
        name: 'TourAdmin',
        component: TourAdmin,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/donations-createTour-admin',
        name: 'DonationsCreateTour',
        component: DonationsCreateTour,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
      path: '/donations-select-truck',
        name: 'DonationsSelectTruck',
        component: DonationsSelectTruck,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/donations-review-and-confirm-tour',
        name: 'DonationsReviewAndConfirmTour',
        component: DonationsReviewAndConfirmTour,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/requests-createTour-admin',
        name: 'RequestsCreateTour',
        component: RequestsCreateTour,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/requests-select-truck',
        name: 'RequestsSelectTruck',
        component: RequestsSelectTruck,
        /*beforeEnter: useAuthGuard(['admin'])*/
    },
    {
        path: '/requests-review-and-confirm-tour',
        name: 'RequestsReviewAndConfirmTour',
        component: RequestsReviewAndConfirmTour,
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
    {path: '/categories', name: 'Categories', component: Categories, /*beforeEnter: useAuthGuard(['admin'])*/},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
