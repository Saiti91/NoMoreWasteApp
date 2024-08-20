<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const donations = ref([]);
const productName = ref('');
const currentPage = ref(1); // Page actuelle
const itemsPerPage = 10; // Nombre d'éléments par page

const router = useRouter();
const route = useRoute();

const fetchDonations = async () => {
  try {
    const productId = route.params.id; // Récupérer le paramètre de l'URL
    const response = await axios.get(`/donations/product/${productId}`);
    donations.value = response.data;
    if (donations.value.length > 0) {
      productName.value = donations.value[0].Name;
    }
    console.log('Donations:', donations.value);
    console.log('Product Name:', productName.value);
  } catch (error) {
    console.error('Error fetching donations:', error);
  }
};

// Pagination calculée
const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return donations.value.slice(start, end);
});

// Calcul du nombre total de pages
const totalPages = computed(() => {
  return Math.ceil(donations.value.length / itemsPerPage);
});

const formatDate = (dateString) => {
  const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Fonctions pour naviguer entre les pages
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

onMounted(() => {
  fetchDonations();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>{{ t('différenteDonationsDe') }} {{ productName }}</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('donationid') }}</th>
        <th>{{ t('donorname') }}</th>
        <th>{{ t('donoremail') }}</th>
        <th>{{ t('quantité') }}</th>
        <th>{{ t('date') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="donation in paginatedDonations" :key="donation.Donation_ID">
        <td>{{ donation.Donation_ID }}</td>
        <td>{{ donation.Donor_Name }} {{ donation.Donor_Firstname }}</td>
        <td>{{ donation.Donor_Email }}</td>
        <td>{{ donation.Quantity }}</td>
        <td>{{ formatDate(donation.Date) }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination Buttons -->
    <div class="pagination-controls">
      <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  margin: 0 10px;
}
</style>
