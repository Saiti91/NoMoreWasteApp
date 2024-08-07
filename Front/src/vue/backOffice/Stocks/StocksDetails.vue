<script setup>
import {onMounted, ref} from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const stocks = ref([]);
const productName = ref('');
const router = useRouter();
const route = useRoute();

const fetchStocks = async () => {
  try {
    const productId = route.params.id; // Récupérer le paramètre de l'URL
    const response = await axios.get(`/stocks/product/${productId}`);
    stocks.value = response.data;
    productName.value = stocks.value[0].Name;
    console.log('Stocks:', stocks.value);
    console.log('Product Name:', productName.value);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
};

const formatDate = (dateString) => {
  const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const goToDetails = (stockId) => {
  router.push({name: 'StocksDetails', params: {id: stockId}});
};

onMounted(() => {
  fetchStocks();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>{{ t('stocksDe\.\.\.') }}</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('stockId') }}</th>
        <th>{{ t('nom') }}</th>
        <th>{{ t('categorie') }}</th>
        <th>{{ t('quantité') }}</th>
        <th>{{ t("dateD'arrivée") }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="stock in stocks" :key="stock.Stock_ID">
        <td>{{ stock.Stock_ID }}</td>
        <td>{{ stock.Name }}</td>
        <td>{{ stock.Storage_Type }}</td>
        <td>{{ stock.Quantity }}</td>
        <td>{{ formatDate(stock.Storage_Date) }}</td>
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

</style>
