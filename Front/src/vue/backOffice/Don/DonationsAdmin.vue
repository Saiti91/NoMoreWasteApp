<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const donnations = ref([]);
const distinctDonations = ref([]);
const router = useRouter();

const fetchDonations = async () => {
  try {
    const response = await axios.get('/donations');
    donnations.value = response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
};

const goToDetails = (donationId) => {
  router.push({ name: 'DonationDetails', params: { id: donationId } });
};

onMounted(() => {
  fetchDonations();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Admin Donations</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('idProduit') }}</th>
        <th>{{ t('nom') }}</th>
        <th>{{ t('categorie') }}</th>
        <th>{{ t('quantité') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="donation in distinctDonations" :key="donation.Product_ID" class="clickable-row" @click="goToDetails(donation.Product_ID)">
        <td>{{ donation.Product_ID }}</td>
        <td>{{ donation.Quantity }}</td>
        <td>{{ donation.Donor_User_ID }}</td>
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
