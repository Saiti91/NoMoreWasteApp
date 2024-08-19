<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from '@/components/HeaderBackOffice.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const donations = ref([]);
const uncollectedDonations = ref([]);
const selectedDonations = ref([]);
const router = useRouter();

const fetchDonations = async () => {
  try {
    const response = await axios.get('/donations');
    donations.value = response.data;

    // Filter donations where Collected is false
    uncollectedDonations.value = donations.value.filter(donation => donation.Collected === 0);

    console.log(uncollectedDonations.value);
  } catch (error) {
    console.error('Error fetching donations:', error);
  }
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const toggleDonationSelection = (donationId) => {
  const index = selectedDonations.value.indexOf(donationId);
  if (index !== -1) {
    selectedDonations.value.splice(index, 1); // Deselect if already selected
  } else {
    selectedDonations.value.push(donationId); // Select if not already selected
  }
};

const isDonationSelected = (donationId) => {
  return selectedDonations.value.includes(donationId);
};

const createTour = async () => {
  try {
    const response = await axios.post('/tours', {
      donation_ids: selectedDonations.value,
    });
    console.log('Tour created:', response.data);
    router.push({ name: 'Tours' }); // Redirect to the tours page after creation
  } catch (error) {
    console.error('Error creating tour:', error);
  }
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
      <h1>Créer une Tournée</h1>
      <button class="ui teal button" @click="createTour" :disabled="selectedDonations.length === 0">
        Créer la Tournée
      </button>
    </div>

    <!-- Table -->
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th></th>
        <th>Nom du produit</th>
        <th>Quantité</th>
        <th>Date</th>
        <th>Type de stockage</th>
        <th>Email du donneur</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="donation in uncollectedDonations" :key="donation.Donation_ID" class="clickable-row">
        <td>
          <input type="checkbox" :checked="isDonationSelected(donation.Donation_ID)"
                 @change="toggleDonationSelection(donation.Donation_ID)">
        </td>
        <td>{{ donation.Product.Name }}</td>
        <td>{{ donation.Quantity }}</td>
        <td>{{ formatDate(donation.Donation_Date) }}</td>
        <td>{{ donation.Product.Storage_Type }}</td>
        <td>{{ donation.Donor_User.Email }}</td>
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
