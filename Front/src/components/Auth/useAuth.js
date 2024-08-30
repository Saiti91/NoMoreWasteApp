import { ref } from 'vue';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import axios from '@/utils/Axios.js';

export default function useAuth() {
    const isAuthenticated = ref(false);
    const isSubscribed = ref(false); // Nouvelle propriété pour vérifier l'abonnement
    const userId = ref(null);

    const token = Cookies.get('token');

    const checkSubscriptionStatus = async () => {
        try {
            const response = await axios.get(`/users/${userId.value}`);
            isSubscribed.value = response.data.IsRegistered === 1;
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'abonnement', error);
        }
    };

    if (token) {
        try {
            const decodedToken = VueJwtDecode.decode(token);
            const expirationTime = decodedToken.exp * 1000;

            if (Date.now() < expirationTime) {
                isAuthenticated.value = true;
                userId.value = decodedToken.uid;

                // Vérifier si l'utilisateur est abonné
                checkSubscriptionStatus();
            } else {
                Cookies.remove('token');
            }
        } catch (error) {
            console.error('Jeton invalide', error);
            Cookies.remove('token');
        }
    }



    const logout = () => {
        Cookies.remove('token');
        isAuthenticated.value = false;
        isSubscribed.value = false;
        userId.value = null;
    };

    return {
        isAuthenticated,
        isSubscribed, // Inclure la propriété isSubscribed dans les retours
        userId,
        logout,
    };
}
