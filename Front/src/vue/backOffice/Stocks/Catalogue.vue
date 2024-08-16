<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";

const products = ref([]);

// Récupération des produits du stock
const fetchProducts = async () => {
  try {
    const response = await axios.get('/stocks');
    products.value = response.data;
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
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container">
    <h2>Catalogue des Produits</h2>
    <div class="ui grid">
      <div v-for="product in products" :key="product.Product_ID" class="four wide column">
        <div class="ui card">
          <div class="content">
            <div class="header">{{ product.Name }}</div>
            <div class="meta">Barcode: {{ product.Barcode }}</div>
            <div class="meta">Type: {{ product.Storage_Type }}</div>
            <div class="meta">Stock: {{ product.Quantity }}</div>
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
