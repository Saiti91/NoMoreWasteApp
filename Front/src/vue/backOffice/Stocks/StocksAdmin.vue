<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const stocks = ref([]);
const filteredStocks = computed(() => {
  let filtered = stocks.value;

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter(stock => stock.Storage_Type === selectedCategory.value);
  }
  if (selectedZone.value && selectedZone.value !== 'all') {
    filtered = filtered.filter(stock => stock.Zone === selectedZone.value);
  }
  if (searchQuery.value) {
    filtered = filtered.filter(stock =>
        stock.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

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

    // Populate categories and zones, add "all" option explicitly
    categories.value = [ ...new Set(stocks.value.map(stock => stock.Storage_Type))];
    zones.value = [ ...new Set(stocks.value.map(stock => stock.Zone))];

    console.log(stocks.value);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
};

const goToDetails = (stockId) => {
  router.push({ name: 'StocksDetails', params: { id: stockId } });
};

onMounted(() => {
  fetchStocks();
});
</script>

<template>
  <HeaderBackOffice />
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
      <tr v-for="product in filteredStocks" :key="product.Product_ID" class="clickable-row" @click="goToDetails(product.Product_ID)">
        <td>{{ product.Name }}</td>
        <td>{{ product.Storage_Type }}</td>
        <td>{{ product.Quantity }}</td>
        <td>{{ product.Zone }}</td>
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
