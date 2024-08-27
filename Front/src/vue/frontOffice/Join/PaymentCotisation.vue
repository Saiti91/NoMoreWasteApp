<script setup>
import Header from "@/components/HeaderFrontOffice.vue";
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from "@/utils/Axios.js";
import { useI18n } from "vue-i18n";
import useAuth from "@/components/Auth/useAuth";

const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const paymentError = ref(null);
const isSubmitting = ref(false);
const amount = ref(9.99);
const router = useRouter();
const t = useI18n().t;

const { userId } = useAuth(); // Récupérer l'ID de l'utilisateur

const setupStripe = async () => {
  try {
    stripe.value = await loadStripe('pk_test_51PX7r7FYikej8zQ9TWuGDqr9ew7vxrMC1QNZIAlQZRnDHtJChmlkURIWO2k7NqXY4dLSqxYx3jJOx9o7clWPjEKe00gJ3nq1uY');
    elements.value = stripe.value.elements();
    cardElement.value = elements.value.create('card');
    cardElement.value.mount('#card-element');
  } catch (error) {
    console.error('Erreur lors de la configuration de Stripe:', error);
    paymentError.value = 'Erreur lors de la configuration de Stripe.';
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  paymentError.value = null;
  try {
    const { error, paymentMethod } = await stripe.value.createPaymentMethod({
      type: 'card',
      card: cardElement.value,
    });

    if (error) {
      paymentError.value = error.message;
      isSubmitting.value = false;
      return;
    }

    const response = await axiosInstance.post('/stripe/charge', {
      paymentMethodId: paymentMethod.id,
      amount: amount.value * 100,  // Montant en centimes
    });

    if (response.data.success) {
      await updateUserSubscription();
      router.push('/payment-success');
    } else {
      paymentError.value = 'Erreur lors du traitement du paiement';
    }
  } catch (err) {
    paymentError.value = err.response ? err.response.data.error : err.message;
  } finally {
    isSubmitting.value = false;
  }
};

const updateUserSubscription = async () => {
  try {
    // Faire une requête pour récupérer la subscription actuelle
    const { data: subscription } = await axiosInstance.get(`/subscriptions/${userId.value}`);

    if (subscription && subscription.Status) {
      // Cas 3: Utilisateur avec abonnement en cours
      const newEndDate = new Date(subscription.End_Date);
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);

      await axiosInstance.patch(`/subscriptions/${userId.value}`, {
        end_date: newEndDate.toISOString().split('T')[0],
        amount: amount.value,
        status: true,
      });
    } else if (subscription) {
      // Cas 2: Utilisateur avec un abonnement expiré
      const newEndDate = new Date();
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);

      await axiosInstance.patch(`/subscriptions/${userId.value}`, {
        end_date: newEndDate.toISOString().split('T')[0],
        amount: amount.value,
        status: true,
      });
    } else {
      // Cas 1: Aucun abonnement précédent, création d'un nouveau
      const newEndDate = new Date();
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);

      await axiosInstance.post(`/subscriptions`, {
        user_id: userId.value,
        end_date: newEndDate.toISOString().split('T')[0],
        amount: amount.value,
        status: true,
      });
    }


  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
  }
};

onMounted(() => {
  setupStripe();
});
</script>

<template>
  <div class="ui container">
    <Header/>
    <div class="spacer"></div>
    <div class="ui segment">
      <h2>{{ t('finishSubTitle') }}</h2>
      <p>{{ t('finishSubTxt') }}{{ amount }}€.</p>

      <form @submit.prevent="handleSubmit" class="ui form">
        <div class="field">
          <label for="card-element">{{ t('cardInfo') }}</label>
          <div id="card-element" class="ui segment"></div>
        </div>
        <button type="submit" class="ui primary button" :class="{ loading: isSubmitting }" :disabled="isSubmitting">
          {{ t('pay') }} {{ amount }}€
        </button>
      </form>
      <div v-if="paymentError" class="ui negative message">
        <p>{{ paymentError }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 10%;
}

.ui.container {
  margin-top: 50px;
}

.ui.segment {
  padding: 40px;
}

.field {
  margin-bottom: 20px;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
