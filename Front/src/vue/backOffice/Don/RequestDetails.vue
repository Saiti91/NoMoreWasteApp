<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const requests = ref([]);
const filteredRequests = computed(() => {
  let filtered = requests.value;

  if (selectedStorageType.value && selectedStorageType.value !== 'all') {
    filtered = filtered.filter(request => request.Product.Storage_Type === selectedStorageType.value);
  }
  if (selectedDateRange.value && selectedDateRange.value[0] && selectedDateRange.value[1]) {
    const [startDate, endDate] = selectedDateRange.value;
    filtered = filtered.filter(request => {
      const requestDate = new Date(request.Date);
      return requestDate >= new Date(startDate) && requestDate <= new Date(endDate);
    });
  }
  if (searchQuery.value) {
    filtered = filtered.filter(request =>
        request.Product.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

const storageTypes = ref([]);
const selectedStorageType = ref('all');
const selectedDateRange = ref([null, null]);  // Initialize as an array with two null values
const searchQuery = ref('');
const router = useRouter();

const fetchRequests = async () => {
  try {
    const response = await axios.get('/requests');
    requests.value = response.data;

    // Populate storage types
    storageTypes.value = [...new Set(requests.value.map(request => request.Product.Storage_Type))];

    console.log(requests.value);
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
};

const formatDate = (dateString) => {
  // Supprimer les fractions de seconde et les 'Z' si présents
  const cleanedDateString = dateString.replace(/\.\d{3}Z$/, '');

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(cleanedDateString);

  // Vérifier si la date est valide
  if (isNaN(date)) {
    return "Invalid Date";
  }

  return date.toLocaleDateString('fr-FR', options);
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
  fetchRequests();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="header-section">
      <h1>Requests Admin</h1>
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
          <label>{{ t('search') }}</label>
          <input type="text" v-model="searchQuery" placeholder="Rechercher un produit...">
        </div>
        <div class="field date-range-field">
          <label>{{ t('dateRange') }}</label>
          <div class="date-range-inputs">
            <input type="date" v-model="selectedDateRange[0]">
            <input type="date" v-model="selectedDateRange[1]">
            <button class="ui button" v-if="isDateSelected" @click="resetDateRange">Réinitialiser la période</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>Nom du produit</th>
        <th>Quantité</th>
        <th>Date</th>
        <th>Type de stockage</th>
        <th>Email du demandeur</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="request in filteredRequests" :key="request.Request_ID" class="clickable-row">
        <td>{{ request.Product.Name }}</td>
        <td>{{ request.Quantity }}</td>
        <td>{{ formatDate(request.Request_Date) }}</td>
        <td>{{ request.Product.Storage_Type }}</td>
        <td @click="goToUserDetails(request.User.User_ID)">{{ request.User.Email }}</td>
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
