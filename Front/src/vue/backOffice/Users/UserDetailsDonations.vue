<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute } from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import UserMenu from "@/components/UserDetailsLeftMenu.vue";

const donations = ref([]);
const route = useRoute();

const fetchUserDonations = async () => {
  try {
    const response = await axios.get(`/donations/${route.params.id}`);
    // Convertir en tableau si la réponse est un objet avec des clés numérotées
    donations.value = response.data
    console.log('Donations value =', donations.value);
  } catch (error) {
    console.error('Error fetching user donations:', error);
  }
};

const formatDate = (date) => {
  if (!date) return 'Non renseigné';
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(date).toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  fetchUserDonations();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenu/>
      <div class="content-area">
        <h2>Détails des donations de l'utilisateur</h2>
        <div v-if="donations.value && donations.value.length > 0" class="user-donations">
          <table class="ui celled table">
            <thead>
            <tr>
              <th>Nom du produit</th>
              <th>Quantité</th>
              <th>Date de donation</th>
              <th>Type de stockage</th>
              <th>Donneur</th>
              <th>Récipiendaire</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="donation in donations.value" :key="donation.Donation_ID">
              <td>{{ donation.Name || 'Non renseigné' }}</td>
              <td>{{ donation.Quantity }}</td>
              <td>{{ formatDate(donation.Date) }}</td>
              <td>{{ donation.Storage_Type || 'Non renseigné' }}</td>
              <td>{{ donation.Donor_Name }} {{ donation.Donor_Firstname }} ({{ donation.Donor_Email }})</td>
              <td>
                  <span v-if="donation.Recipient_User_ID">
                    {{ donation.Recipient_Name }} {{ donation.Recipient_Firstname }} ({{ donation.Recipient_Email }})
                  </span>
                <span v-else>
                    Non assigné
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>Aucune donation trouvée pour cet utilisateur.</p>
        </div>
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
