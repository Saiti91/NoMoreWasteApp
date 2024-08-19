<script setup>
import {computed, onMounted, ref} from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const donations = ref([]);
const selectedStorageType = ref('all');
const selectedDateRange = ref([null, null]);
const searchQuery = ref('');
const selectedCollectedStatus = ref('all'); // New filter for collected status
const selectedRoute = ref('all'); // New filter for routes
const storageTypes = ref([]);
const routes = ref([]); // Store available routes
const router = useRouter();

const filteredDonations = computed(() => {
  let filtered = donations.value;

  if (selectedStorageType.value && selectedStorageType.value !== 'all') {
    filtered = filtered.filter(donation => donation.Product.Storage_Type === selectedStorageType.value);
  }
  if (selectedDateRange.value && selectedDateRange.value[0] && selectedDateRange.value[1]) {
    const [startDate, endDate] = selectedDateRange.value;
    filtered = filtered.filter(donation => {
      const donationDate = new Date(donation.Donation_Date);
      return donationDate >= new Date(startDate) && donationDate <= new Date(endDate);
    });
  }
  if (searchQuery.value) {
    filtered = filtered.filter(donation =>
        donation.Product.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  if (selectedCollectedStatus.value !== 'all') {
    filtered = filtered.filter(donation => donation.Collected === (selectedCollectedStatus.value === 'collected'));
  }
  if (selectedRoute.value !== 'all') {
    filtered = filtered.filter(donation => donation.Route && donation.Route.Route_ID === parseInt(selectedRoute.value));
  }

  return filtered;
});

const fetchDonations = async () => {
  try {
    const response = await axios.get('/donations');
    donations.value = response.data;

    // Populate storage types
    storageTypes.value = [...new Set(donations.value.map(donation => donation.Product.Storage_Type))];

    // Populate routes
    routes.value = [...new Set(donations.value.map(donation => donation.Route ? donation.Route.Route_ID : null).filter(route => route !== null))];

    console.log(donations.value);
  } catch (error) {
    console.error('Error fetching donations:', error);
  }
};

const formatDate = (dateString) => {
  const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const goToUserDetails = (user_id) => {
  router.push({name: 'UserDetails', params: {id: user_id}});
};

const goToCreateTour = () => {
  router.push({name: 'CreateTour'});
};

// Function to reset the date range
const resetDateRange = () => {
  selectedDateRange.value = [null, null];
};

// Computed property to check if a date is selected
const isDateSelected = computed(() => {
  return selectedDateRange.value[0] !== null || selectedDateRange.value[1] !== null;
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
      <tr v-for="donation in filteredDonations" :key="donation.Donation_ID" class="clickable-row">
        <td>{{ donation.Product.Name }}</td>
        <td>{{ donation.Quantity }}</td>
        <td>{{ formatDate(donation.Donation_Date) }}</td>
        <td>{{ donation.Product.Storage_Type }}</td>
        <td @click="goToUserDetails(donation.Donor_User.User_ID)">{{ donation.Donor_User.Email }}</td>
        <td>{{ donation.Collected ? 'Collecté' : 'Non collecté' }}</td>
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
</style>
