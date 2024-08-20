<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const donations = ref([]);
const currentPage = ref(1); // Page actuelle
const itemsPerPage = 10; // Nombre d'éléments par page

const selectedStorageType = ref('all');
const selectedDateRange = ref([null, null]);
const searchQuery = ref('');
const selectedCollectedStatus = ref('all'); // Filtre pour le statut de collecte
const selectedRoute = ref('all'); // Filtre pour les routes
const storageTypes = ref([]);
const routes = ref([]); // Stocker les routes disponibles
const router = useRouter();

// Fonction pour normaliser une chaîne (supprimer les accents)
const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const filteredDonations = computed(() => {
  let filtered = donations.value;

  // Filtre par catégorie de stockage
  if (selectedStorageType.value && selectedStorageType.value !== 'all') {
    filtered = filtered.filter(donation => donation.Product.Category === selectedStorageType.value);
  }

  // Filtre par plage de dates
  if (selectedDateRange.value && selectedDateRange.value[0] && selectedDateRange.value[1]) {
    const [startDate, endDate] = selectedDateRange.value;
    filtered = filtered.filter(donation => {
      const donationDate = new Date(donation.Donation_Date);
      return donationDate >= new Date(startDate) && donationDate <= new Date(endDate);
    });
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const normalizedSearchQuery = normalizeString(searchQuery.value);
    filtered = filtered.filter(donation =>
        normalizeString(donation.Product.Name).includes(normalizedSearchQuery)
    );
  }

  // Filtre par statut de collecte
  if (selectedCollectedStatus.value !== 'all') {
    const isCollected = selectedCollectedStatus.value === 'collected';
    filtered = filtered.filter(donation => Boolean(donation.Collected) === isCollected);
  }

  // Filtre par route
  if (selectedRoute.value !== 'all') {
    filtered = filtered.filter(donation => donation.Route && donation.Route.Route_ID === parseInt(selectedRoute.value));
  }

  return filtered;
});

// Pagination calculée
const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredDonations.value.slice(start, end);
});

// Calcul du nombre total de pages
const totalPages = computed(() => {
  return Math.ceil(filteredDonations.value.length / itemsPerPage);
});

const fetchDonations = async () => {
  try {
    const response = await axios.get('/donations');
    donations.value = response.data;

    // Populate storage types (using Category here as Category is your actual data field)
    storageTypes.value = [...new Set(donations.value.map(donation => donation.Product.Category))];

    // Populate routes
    routes.value = [...new Set(donations.value.map(donation => donation.Route ? donation.Route.Route_ID : null).filter(route => route !== null))];

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
  router.push({ name: 'CreateTour' });
};

// Function to reset the date range
const resetDateRange = () => {
  selectedDateRange.value = [null, null];
};

// Computed property to check if a date is selected
const isDateSelected = computed(() => {
  return selectedDateRange.value[0] !== null || selectedDateRange.value[1] !== null;
});

// Watchers pour réinitialiser currentPage lorsque les filtres changent
watch([searchQuery, selectedStorageType, selectedCollectedStatus, selectedRoute, selectedDateRange], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchDonations();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="header-section">
      <h1>Donations Admin</h1>
      <button class="ui teal button" @click="goToCreateTour">Créer une tournée</button>
    </div>

    <!-- Filters -->
    <div class="ui form">
      <div class="fields">
        <div class="field">
          <label>{{ t('category') }}</label>
          <select v-model="selectedStorageType" class="ui dropdown">
            <option value="all">{{ t('allCategories') }}</option>
            <option v-for="type in storageTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('status') }}</label>
          <select v-model="selectedCollectedStatus" class="ui dropdown">
            <option value="all">{{ t('allstatuses') }}</option>
            <option value="collected">{{ t('Collected') }}</option>
            <option value="not_collected">{{ t('notcollected') }}</option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('search') }}</label>
          <input type="text" v-model="searchQuery" placeholder="Rechercher un produit...">
        </div>

        <div class="field date-range-field">
          <label>{{ t('dateRange') }}</label>
          <div class="date-range-inputs">
            <input type="date" v-model="selectedDateRange[0]">
            <input type="date" v-model="selectedDateRange[1]">
            <button class="ui button" v-if="isDateSelected" @click="resetDateRange">{{ t('reinitialiserLaPeriode') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('productName') }}</th>
        <th>{{t('quantité')}}</th>
        <th>Date</th>
        <th>{{t('category')}}</th>
        <th>{{ t('donoremail') }}</th>
        <th>{{ t('statutDeCollecte') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="donation in paginatedDonations" :key="donation.Donation_ID" class="clickable-row">
        <td>{{ donation.Product.Name }}</td>
        <td>{{ donation.Quantity }}</td>
        <td>{{ formatDate(donation.Donation_Date) }}</td>
        <td>{{ donation.Product.Category }}</td>
        <td @click="goToUserDetails(donation.Donor_User.User_ID)">{{ donation.Donor_User.Email }}</td>
        <td>{{ donation.Collected ? 'Collecté' : 'Non collecté' }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination Buttons -->
    <div class="pagination-controls">
      <button @click="currentPage > 1 && currentPage--" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="currentPage < totalPages && currentPage++" :disabled="currentPage === totalPages">Suivant</button>
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ui.form .fields .date-range-field {
  display: flex;
  flex-direction: column;
}

.date-range-inputs {
  display: flex;
  align-items: center;
}

.date-range-inputs input[type="date"] {
  margin-right: 10px;
  flex: 1;
}

.date-range-inputs button {
  margin-left: 10px;
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
