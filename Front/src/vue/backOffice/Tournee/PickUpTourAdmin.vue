<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const tours = ref([]);
const currentPage = ref(1); // Page actuelle
const itemsPerPage = 10; // Nombre d'éléments par page

// Variables pour les filtres
const selectedDriver = ref('all');
const selectedTruck = ref('all');
const selectedDateRange = ref([null, null]);

const fetchTours = async () => {
  try {
    const response = await axios.get('/tours');

    // Filtrer les tournées de type 1 (ramassage) et trier par date décroissante
    tours.value = response.data
        .filter(tour => tour.Route_Type === 1)
        .sort((a, b) => new Date(b.Route_Date) - new Date(a.Route_Date)); // Tri décroissant par date

    console.log(tours.value);
  } catch (error) {
    console.error('Error fetching tours:', error);
  }
};

// Fonction pour normaliser une chaîne (supprimer les accents)
const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// Propriété calculée pour filtrer les tournées
const filteredTours = computed(() => {
  let filtered = tours.value;

  // Filtrer par chauffeur
  if (selectedDriver.value !== 'all') {
    filtered = filtered.filter(tour => normalizeString(tour.Driver.Driver_Name) === normalizeString(selectedDriver.value));
  }

  // Filtrer par camion
  if (selectedTruck.value !== 'all') {
    filtered = filtered.filter(tour => normalizeString(tour.Truck.Truck_Registration) === normalizeString(selectedTruck.value));
  }

  // Filtrer par plage de dates
  if (selectedDateRange.value[0] && selectedDateRange.value[1]) {
    const [startDate, endDate] = selectedDateRange.value;
    filtered = filtered.filter(tour => {
      const tourDate = new Date(tour.Route_Date);
      return tourDate >= new Date(startDate) && tourDate <= new Date(endDate);
    });
  }

  return filtered;
});

// Pagination calculée
const paginatedTours = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTours.value.slice(start, end);
});

// Calcul du nombre total de pages
const totalPages = computed(() => {
  return Math.ceil(filteredTours.value.length / itemsPerPage);
});

const goToDetails = (tourId) => {
  router.push({name: 'tourDetails', params: {id: tourId}});
};

const calculateTotalQuantity = (destinations) => {
  return destinations.reduce((total, destination) => {
    return total + destination.Products.reduce((sum, product) => sum + product.Quantity, 0);
  }, 0);
};

// Fonction pour réinitialiser la plage de dates
const resetDateRange = () => {
  selectedDateRange.value = [null, null];
};

// Propriété calculée pour vérifier si une date est sélectionnée
const isDateSelected = computed(() => {
  return selectedDateRange.value[0] !== null || selectedDateRange.value[1] !== null;
});

// Watchers pour réinitialiser currentPage lorsque les filtres changent
watch([selectedDriver, selectedTruck, selectedDateRange], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchTours();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>{{ t('tourneesDeCollecte') }}</h1>

    <!-- Filters -->
    <div class="ui form">
      <div class="fields">
        <div class="field">
          <label>{{ t('chauffeur') }}</label>
          <select v-model="selectedDriver" class="ui dropdown">
            <option value="all">{{ t('alldrivers') }}</option>
            <option v-for="tour in tours" :key="tour.Driver.Driver_Name" :value="tour.Driver.Driver_Name">
              {{ tour.Driver.Driver_Name }}
            </option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('camion') }}</label>
          <select v-model="selectedTruck" class="ui dropdown">
            <option value="all">{{ t('alltrucks') }}</option>
            <option v-for="tour in tours" :key="tour.Truck.Truck_Registration" :value="tour.Truck.Truck_Registration">
              {{ tour.Truck.Truck_Registration }} - {{ tour.Truck.Truck_Model }}
            </option>
          </select>
        </div>
        <div class="field date-range-field">
          <label>{{ t('dateRange') }}</label>
          <div class="date-range-inputs">
            <input type="date" v-model="selectedDateRange[0]">
            <input type="date" v-model="selectedDateRange[1]">
            <button class="ui button" v-if="isDateSelected" @click="resetDateRange">
              {{ t('reinitialiserLaPeriode') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('numeroDeTournee') }}</th>
        <th>Date</th>
        <th>{{ t('chauffeur') }}</th>
        <th>{{ t('camion') }}</th>
        <th>{{ t('capaciteDuCamion') }}</th>
        <th>{{ t('nombreDeDestinations') }}</th>
        <th>{{ t('totalQuantity') }}</th>
        <th>{{ t('actions') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="tour in paginatedTours" :key="tour.Route_ID" class="clickable-row" @click="goToDetails(tour.Route_ID)">
        <td>{{ tour.Route_ID }}</td>
        <td>{{ new Date(tour.Route_Date).toLocaleDateString() }}</td>
        <td>{{ tour.Driver.Driver_Name }}</td>
        <td>{{ tour.Truck.Truck_Registration }} - {{ tour.Truck.Truck_Model }}</td>
        <td>{{ tour.Truck.Truck_Capacity }}</td>
        <td>{{ tour.Destinations.length }}</td>
        <td>{{ calculateTotalQuantity(tour.Destinations) }}</td>
        <td>
          <button @click.stop="goToDetails(tour.Route_ID)" class="ui button">
            {{ t('voirDetails') }}
          </button>
        </td>
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

.ui.celled.table.full-width-table {
  width: 100%;
}

.ui.celled.table tr.clickable-row {
  cursor: pointer;
}

.ui.celled.table tr.clickable-row:hover {
  background-color: #f1f1f1;
}

.ui.button {
  background-color: #2185d0;
  color: white;
}

.ui.button:hover {
  background-color: #1678c2;
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

.pagination-controls {
  display: flex;
  justify-content: center; /* Centre les boutons horizontalement */
  align-items: center; /* Centre les éléments verticalement */
  margin-top: 20px;
}
</style>
