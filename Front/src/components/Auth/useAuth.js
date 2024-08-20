// src/components/Auth/useAuth.js
import { ref } from 'vue';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';

export default function useAuth() {
    const isAuthenticated = ref(false);
    const userId = ref(null);

    const token = Cookies.get('token');

    if (token) {
        try {
            const decodedToken = VueJwtDecode.decode(token);
            const expirationTime = decodedToken.exp * 1000;

            if (Date.now() < expirationTime) {
                isAuthenticated.value = true;
                userId.value = decodedToken.uid;
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
        userId.value = null;
    };

    return {
        isAuthenticated,
        userId,
        logout,
    };
}
