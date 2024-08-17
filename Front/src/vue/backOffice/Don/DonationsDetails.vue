<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const donations = ref([]);
const router = useRouter();

const fetchDonations = async () => {
  try {
    const response = await axios.get('/donations');
    donations.value = response.data;
    console.log(donations.value);
  } catch (error) {
    console.error('Error fetching donations:', error);
  }
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const goToUserDetails = (user_id) => {
  router.push({ name: 'UserDetails', params: { id: user_id } });
};

const goToCreateTour = () => {
  router.push({ name: 'CreateTour' }); // Assurez-vous que la route 'CreateTour' existe dans votre router
};

onMounted(() => {
  fetchDonations();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="header-section">
      <h1>Donations Admin</h1>
      <button class="ui teal button" @click="goToCreateTour">Créer une tournée</button>
    </div>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>Nom du produit</th>
        <th>Quantité</th>
        <th>Date</th>
        <th>Type de stockage</th>
        <th>Email du donneur</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="donation in donations" :key="donation.Donation_ID" class="clickable-row">
        <td>{{ donation.Product.Name }}</td>
        <td>{{ donation.Quantity }}</td>
        <td>{{ formatDate(donation.Donation_Date) }}</td>
        <td>{{ donation.Product.Storage_Type }}</td>
        <td @click="goToUserDetails(donation.Donor_User.User_ID)">{{ donation.Donor_User.Email }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.spacer {
  margin: 20px 0;
}

.ui.container.full-width {
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ui.celled.table.full-width-table {
  width: 100%;
}

.ui.celled.table tr.clickable-row {
  cursor: pointer;
}

.ui.celled.table tr.clickable-row:hover {
  background-color: #f1f1f1;
}
</style>
