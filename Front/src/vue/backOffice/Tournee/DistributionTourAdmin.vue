<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const tours = ref([]);
const router = useRouter();

const fetchTours = async () => {
  try {
    const response = await axios.get('/tours');

    // Filtrer les tournées de type 0 (distribution) et trier par date décroissante
    tours.value = response.data
        .filter(tour => tour.Route_Type === 0)
        .sort((a, b) => new Date(b.Route_Date) - new Date(a.Route_Date)); // Tri décroissant par date

    console.log(tours.value);
  } catch (error) {
    console.error('Error fetching tours:', error);
  }
};

const goToDetails = (tourId) => {
  router.push({ name: 'tourDetails', params: { id: tourId } });
};

const calculateTotalQuantity = (destinations) => {
  return destinations.reduce((total, destination) => {
    return total + destination.Products.reduce((sum, product) => sum + product.Quantity, 0);
  }, 0);
};

onMounted(() => {
  fetchTours();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>{{ t('distributionTour') }}</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>Numéro de Tournée</th>
        <th>Date</th>
        <th>Chauffeur</th>
        <th>Camion</th>
        <th>Capacité du Camion (m³)</th>
        <th>Nombre de Destinations</th>
        <th>Quantité Totale</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="tour in tours" :key="tour.Route_ID" class="clickable-row" @click="goToDetails(tour.Route_ID)">
        <td>{{ tour.Route_ID }}</td>
        <td>{{ new Date(tour.Route_Date).toLocaleDateString() }}</td>
        <td>{{ tour.Driver.Driver_Name }}</td>
        <td>{{ tour.Truck.Truck_Registration }} - {{ tour.Truck.Truck_Model }}</td>
        <td>{{ tour.Truck.Truck_Capacity }}</td>
        <td>{{ tour.Destinations.length }}</td>
        <td>{{ calculateTotalQuantity(tour.Destinations) }}</td>
        <td>
          <button @click.stop="goToDetails(tour.Route_ID)" class="ui button">
            Voir Détails
          </button>
        </td>
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

.ui.button {
  background-color: #2185d0;
  color: white;
}

.ui.button:hover {
  background-color: #1678c2;
}
</style>
