<script setup>
import {onMounted, ref} from 'vue';
import axios from '@/utils/Axios.js';
import {useRoute} from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import UserMenu from "@/components/UserDetailsLeftMenu.vue";

const user = ref(null);
const route = useRoute();

const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`/users/${route.params.id}`);
    user.value = response.data;
    console.log('User value =', user.value);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

const formatDate = (date) => {
  if (!date) return 'Non renseigné';
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(date).toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  fetchUserDetails();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenu/>
      <div class="content-area">
        <h2>Détails de l'utilisateur</h2>
        <div v-if="user" class="user-details">
          <p><strong>Nom :</strong> {{ user.Name || 'Non renseigné' }}</p>
          <p><strong>Prénom :</strong> {{ user.Firstname || 'Non renseigné' }}</p>
          <p><strong>Email :</strong> {{ user.Email }}</p>
          <p><strong>Téléphone :</strong> {{ user.Phone || 'Non renseigné' }}</p>
          <p><strong>Rôle :</strong> {{ user.Role }}</p>
          <p><strong>Date de naissance :</strong> {{ formatDate(user.Birthdate) }}</p>
          <p><strong>Statut de l'abonnement :</strong>
            <span v-if="user.Current_Subscription" class="status-active">Abonné</span>
            <span v-else>Non Abonné</span>
          </p>
        </div>

        <!-- Les sections spécifiques seront chargées selon la route actuelle -->
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  margin: 20px 0;
}

/* Adjustments to ensure the content area does not overlap with the menu */
.content-area {
  padding: 20px;
  margin-left: 50px; /* Match this with the actual width of the menu */
  width: calc(70% - 50px); /* Ensure this calculation takes into account the menu's width */
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
</style>
