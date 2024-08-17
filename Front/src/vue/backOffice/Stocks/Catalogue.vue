<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useI18n } from 'vue-i18n';

const products = ref([]);
const t = useI18n().t;
const filteredProducts = computed(() => {
  let filtered = products.value;

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.Storage_Type === selectedCategory.value);
  }
  if (selectedZone.value && selectedZone.value !== 'all') {
    filtered = filtered.filter(product => product.Zone === selectedZone.value);
  }
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
        product.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

const categories = ref([]);
const zones = ref([]);
const selectedCategory = ref('all');
const selectedZone = ref('all');
const searchQuery = ref('');

const fetchProducts = async () => {
  try {
    const response = await axios.get('/stocks');
    products.value = response.data;

    // Populate categories and zones, add "all" option explicitly
    categories.value = [...new Set(products.value.map(product => product.Storage_Type))];
    zones.value = [...new Set(products.value.map(product => product.Zone))];

    console.log('Produits:', products.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
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

    <div class="ui grid">
      <div v-for="product in filteredProducts" :key="product.Product_ID" class="four wide column">
        <div class="ui card">
          <div class="content">
            <div class="header">{{ product.Name }}</div>
            <div class="meta">Code-barres: {{ product.Barcode }}</div>
            <div class="meta">Type: {{ product.Storage_Type }}</div>
            <div class="meta">Stock: {{ product.Quantity }}</div>
            <div class="meta">Zone: {{ product.Zone }}</div>
          </div>
        </div>
      </div>
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
</style>
