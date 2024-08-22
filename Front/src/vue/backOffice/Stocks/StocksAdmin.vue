<script setup>
import {onMounted, ref, computed, watch} from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const stocks = ref([]);
const currentPage = ref(1); // Current page
const itemsPerPage = 10; // Number of items per page

const categories = ref([]);
const zones = ref([]);
const selectedCategory = ref('all');
const selectedZone = ref('all');
const searchQuery = ref('');
const router = useRouter();

const fetchStocks = async () => {
  try {
    const response = await axios.get('/stocks');
    stocks.value = response.data;

    // Populate categories and zones
    categories.value = [...new Set(stocks.value.map(stock => stock.Category_Name))];
    zones.value = [...new Set(stocks.value.map(stock => stock.StorageSector))];

    console.log(stocks.value);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
};

// Normalize strings for filtering (removing accents, case-insensitive)
const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// Computed property to filter stocks
const filteredStocks = computed(() => {
  let filtered = stocks.value;

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter(stock => stock.Category_Name === selectedCategory.value);
  }
  if (selectedZone.value && selectedZone.value !== 'all') {
    filtered = filtered.filter(stock => stock.StorageSector === selectedZone.value);
  }
  if (searchQuery.value) {
    const normalizedSearchQuery = normalizeString(searchQuery.value);
    filtered = filtered.filter(stock =>
        normalizeString(stock.Name).includes(normalizedSearchQuery)
    );
  }

  return filtered;
});

// Computed property for paginated stocks
const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredStocks.value.slice(start, end);
});

// Compute the total number of pages
const totalPages = computed(() => {
  return Math.ceil(filteredStocks.value.length / itemsPerPage);
});

// Navigate to stock details
const goToDetails = (stockId) => {
  router.push({name: 'StocksDetails', params: {id: stockId}});
};

// Functions for pagination
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

// Watch for changes in filters to reset pagination
watch([searchQuery, selectedCategory, selectedZone], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchStocks();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Stocks Admin</h1>

    <!-- Filters -->
    <div class="ui form">
      <div class="fields">
        <div class="field">
          <label>{{ t('categorie') }}</label>
          <select v-model="selectedCategory" class="ui dropdown">
            <option value="all">{{ t('allCategories') }}</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('zoneDeStockage') }}</label>
          <select v-model="selectedZone" class="ui dropdown">
            <option value="all">{{ t('allZones') }}</option>
            <option v-for="zone in zones" :key="zone" :value="zone">{{ zone }}</option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('search') }}</label>
          <input type="text" v-model="searchQuery" placeholder="Rechercher un produit...">
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('nom') }}</th>
        <th>{{ t('categorie') }}</th>
        <th>{{ t('quantité') }}</th>
        <th>{{ t('zoneDeStockage') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in paginatedStocks" :key="product.Product_ID" class="clickable-row"
          @click="goToDetails(product.Product_ID)">
        <td>{{ product.Name }}</td>
        <td>{{ product.Category_Name }}</td>
        <td>{{ product.Quantity }}</td>
        <td>{{ product.StorageSector }}</td>
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
