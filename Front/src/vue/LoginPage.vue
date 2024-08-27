<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import axiosInstance from "../utils/Axios.js";
import Swal from 'sweetalert2';
import { useI18n } from 'vue-i18n';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const { t } = useI18n();

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Vérifier si l'utilisateur est abonné et si oui contrôler la date de fin
const checkSubscription = async (userId) => {
  try {
    const response = await axiosInstance.get(`/subscriptions/${userId}`);
    const subscription = response.data;

    if (!subscription) {
      // Pas d'abonnement trouvé, rediriger vers la page d'accueil
      router.push('/');
      return;
    }

    // Vérifier si l'abonnement est déjà expiré (statut false)
    if (!subscription.Status) {
      // Rediriger directement vers la page d'accueil
      router.push('/');
      return;
    }

    const endDate = new Date(subscription.End_Date);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 3600 * 24));

    if (daysRemaining <= 14 && daysRemaining > 0) {
      // Afficher un message d'alerte selon les jours restants
      let alertMessage;
      if (daysRemaining > 7) {
        alertMessage = t('subscriptionExpiringInTwoWeeks');
      } else if (daysRemaining > 3) {
        alertMessage = t('subscriptionExpiringInOneWeek');
      } else if (daysRemaining > 1) {
        alertMessage = t('subscriptionExpiringInThreeDays');
      } else if (daysRemaining === 1) {
        alertMessage = t('subscriptionExpiringTomorrow');
      }

      await Swal.fire({
        icon: 'warning',
        title: t('subscriptionAlertTitle'),
        text: alertMessage,
        confirmButtonText: 'OK',
      });
      router.push('/');
    } else if (daysRemaining <= 0) {
      // Abonnement expiré, mettre à jour le statut et la date dans l'API
      await axiosInstance.patch(`/subscriptions/${userId}`, {
        status: false,
        end_date: today.toISOString().split('T')[0],
      });
      await Swal.fire({
        icon: 'error',
        title: t('subscriptionExpiredTitle'),
        text: t('subscriptionExpiredMessage'),
        confirmButtonText: 'OK',
      });
      router.push('/');
    } else {
      // Abonnement valide, rediriger vers la page d'accueil
      router.push('/');
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    router.push('/');
  }
};

const submitForm = async () => {
  errorMessage.value = '';

  if (!validateEmail(email.value)) {
    errorMessage.value = t('invalidEmailFormat');
    console.log('Error Message:', errorMessage.value);
    return;
  }

  const data = {
    email: email.value,
    password: password.value
  };

  try {
    const response = await axiosInstance.post('auth/login/', data);
    if (response.status !== 200) {
      errorMessage.value = `Error: ${response.status}`;
      console.log('Error Message:', errorMessage.value);
      return;
    }

    const authHeader = response.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
    if (token) {
      Cookies.set('token', token);
      const decodedToken = VueJwtDecode.decode(token);

      // Vérification de l'abonnement après la connexion
      await checkSubscription(decodedToken.uid);

    } else {
      errorMessage.value = t('tokenNotFound');
      console.log('Error Message:', errorMessage.value);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage.value = t('incorrectPasswordOrEmail');
        router.push('/login');
      } else if (error.response.status === 400) {
        errorMessage.value = t('badRequest');
      } else if (error.response.data && error.response.data.message) {
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = t('an_error_occurred');
      }
    } else {
      errorMessage.value = 'Network error, please try again later';
    }
    console.log('Error Message:', errorMessage.value);
  }
};
</script>


<template>
  <div class="ui middle aligned center aligned grid" style="height: 100vh;">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header">
        {{ t('account_Login') }}
      </h2>
      <form class="ui large form" @submit.prevent="submitForm">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="email" v-model="email" name="email" :placeholder="t('email')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="password" name="password" :placeholder="t('password')" required>
            </div>
          </div>
          <button class="ui fluid large teal submit button" type="submit">{{ t('account_Login') }}</button>
        </div>

        <div class="ui error message" v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </form>
      <div class="ui message">{{ t('new_to_us') }}
        <router-link to="/sign-up" class="item">{{ t('sign_up') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui.error.message {
  display: block !important;
}
</style>
