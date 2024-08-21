<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute, useRouter } from 'vue-router';
import Header from "@/components/HeaderFrontOffice.vue";
import UserMenuFO from "@/components/UserDetailsLeftMenuFO.vue";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n';

const user = ref(null);
const t = useI18n().t;
const route = useRoute();
const router = useRouter();

const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`/users/${route.params.id}`);
    user.value = response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

const deleteUser = async () => {
  Swal.fire({
    title: t('popupDelUserFO'),
    text: t('popupDelUserTxt'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('yesDel'),
    cancelButtonText: t('cancel')
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/users/${route.params.id}`);
        await validateSuppression();
        router.push('/users');
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
          icon: 'error',
          title: t('error_title'),
          text: t('errorDelTxt'),
        });
      }
    }
  });
};

const validateSuppression = () => {
  // Afficher une pop-up de confirmation de suppression
  Swal.fire({
    icon: 'success',
    title: t('deleted'),
    text: t('successDelUserTxt'),
  });
};

const formatDate = (date) => {
  if (!date) return t('noInfo');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  fetchUserDetails();
});
</script>

<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenuFO />
      <div class="content-area">
        <div class="header-section">
          <h2>{{ t('userDetails') }}</h2>
          <button @click="deleteUser" class="ui red button">{{ t('delete') }}</button>
        </div>
        <div v-if="user" class="user-details">
          <p><strong>{{ t('last-name') }} :</strong> {{ user.Name || t('noInfo') }}</p>
          <p><strong>{{ t('first-name') }} :</strong> {{ user.Firstname || t('noInfo') }}</p>
          <p><strong>{{ t('email') }} :</strong> {{ user.Email }}</p>
          <p><strong>{{ t('phone') }} :</strong> {{ user.Phone || t('noInfo') }}</p>
          <p><strong>{{ t('role') }} :</strong> {{ user.Role }}</p>
          <p><strong>{{ t('birthdate') }} :</strong> {{ formatDate(user.Birthdate) }}</p>
          <p><strong>{{ t('subscriptionStatus') }} :</strong>
            <span v-if="user.Current_Subscription" class="status-active">{{ t('subscriber') }}</span>
            <span v-else class="status-inactive">{{ t('nonSubscriber') }}</span>
          </p>
          <h3>{{ t('address') }}</h3>
          <p><strong>{{ t('street') }} :</strong> {{ user.Street || t('noInfo') }}</p>
          <p><strong>{{ t('city') }} :</strong> {{ user.City || t('noInfo') }}</p>
          <p><strong>{{ t('state') }} :</strong> {{ user.State || t('noInfo') }}</p>
          <p><strong>{{ t('postalCode') }} :</strong> {{ user.Postal_Code || t('noInfo') }}</p>
          <p><strong>{{ t('country') }}:</strong> {{ user.Country || t('noInfo') }}</p>
        </div>

        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer_perso {
  margin: 7% ;
}

/* Adjustments to ensure the content area does not overlap with the menu */
.content-area {
  padding: 20px;
  margin-left: 50px; /* Match this with the actual width of the menu */
  width: calc(70% - 50px); /* Ensure this calculation takes into account the menu's width */
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-details {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
}

.user-details p {
  margin: 10px 0;
}

.user-details strong {
  display: inline-block;
  width: 150px;
  color: #333;
}

.status-active {
  color: green;
  font-weight: bold;
}

.status-inactive {
  color: red;
  font-weight: bold;
}

h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #4a4a4a;
}

h3 {
  margin-top: 20px;
  font-size: 1.5em;
  color: #333;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}
</style>
