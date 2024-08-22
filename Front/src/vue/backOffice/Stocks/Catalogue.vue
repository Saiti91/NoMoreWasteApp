<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from '@/components/HeaderBackOffice.vue';
import {useI18n} from 'vue-i18n';

const t = useI18n().t;

// Reactive variables
const products = ref([]);
const selectedCategory = ref('all');
const selectedZone = ref('all');
const searchQuery = ref('');

const currentPage = ref(1); // Current page
const itemsPerPage = 12; // Items per page

// Normalization function to handle accents and case-sensitivity
const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// Computed properties for filtering products
const filteredProducts = computed(() => {
  let filtered = products.value;

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.Category_Name === selectedCategory.value);
  }
  if (selectedZone.value && selectedZone.value !== 'all') {
    filtered = filtered.filter(product => product.StorageSector === selectedZone.value);
  }
  if (searchQuery.value) {
    const normalizedSearchQuery = normalizeString(searchQuery.value);
    filtered = filtered.filter(product =>
        normalizeString(product.Name).includes(normalizedSearchQuery)
    );
  }

  return filtered;
});

// Computed properties for pagination
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

// Calculate total number of pages
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

// Fetch product data and populate filters
const fetchProducts = async () => {
  try {
    const response = await axios.get('/stocks');
    products.value = response.data;

    // Populate categories and zones
    categories.value = [...new Set(products.value.map(product => product.Category_Name))];
    zones.value = [...new Set(products.value.map(product => product.StorageSector))];

    console.log('Produits:', products.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
  }
};

const categories = ref([]);
const zones = ref([]);

// Watchers to reset currentPage when filters change
watch([searchQuery, selectedCategory, selectedZone], () => {
  currentPage.value = 1;
});

// Pagination controls
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
  fetchProducts();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container">
    <h2>Catalogue des Produits</h2>

    <!-- Filters -->
    <div class="ui form">
      <div class="fields">
        <div class="field">
          <label>Catégorie</label>
          <select v-model="selectedCategory" class="ui dropdown">
            <option value="all">{{ t('allCategories') }}</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="field">
          <label>Zone de Stockage</label>
          <select v-model="selectedZone" class="ui dropdown">
            <option value="all">{{ t('allZones') }}</option>
            <option v-for="zone in zones" :key="zone" :value="zone">{{ zone }}</option>
          </select>
        </div>
        <div class="field">
          <label>Rechercher</label>
          <input type="text" v-model="searchQuery" placeholder="Rechercher un produit...">
        </div>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="ui grid">
      <div v-for="product in paginatedProducts" :key="product.Product_ID" class="four wide column">
        <div class="ui card">
          <div class="content">
            <div class="header">{{ product.Name }}</div>
            <div class="meta">Code-barres: {{ product.Barcode }}</div>
            <div class="meta">Type: {{ product.Category_Name }}</div>
            <div class="meta">Stock: {{ product.Quantity }}</div>
            <div class="meta">Zone: {{ product.StorageSector }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 1%;
}

.ui.container {
  padding: 20px;
}

.ui.grid {
  padding-top: 20px;
}

.ui.card {
  width: 100%;
  margin-bottom: 20px;
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
