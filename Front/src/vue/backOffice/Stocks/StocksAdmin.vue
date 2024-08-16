<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const stocks = ref([]);
const distinctProducts = ref([]);
const router = useRouter();

const fetchStocks = async () => {
  try {
    const response = await axios.get('/stocks');
    stocks.value = response.data;
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
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('nom') }}</th>
        <th>{{ t('categorie') }}</th>
        <th>{{ t('quantité') }}</th>
        <th>{{t('zoneDeStockage')}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in stocks" :key="product.Product_ID" class="clickable-row" @click="goToDetails(product.Product_ID)">
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
