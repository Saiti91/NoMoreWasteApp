<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import { useStore } from 'vuex';
import HeaderBackOffice from '@/components/HeaderBackOffice.vue';
import { useRouter } from 'vue-router';

const trucks = ref([]);
const selectedTruck = ref(null); // This will now hold the entire truck object
const store = useStore();
const router = useRouter();

const fetchAvailableTrucks = async () => {
  try {
    const response = await axios.get('/trucks/availableToday');
    trucks.value = response.data;
    console.log('Available trucks:', trucks.value);
  } catch (error) {
    console.error('Error fetching available trucks:', error);
  }
};

const getConditionText = (condition) => {
  switch (condition) {
    case 1:
      return 'Très bon état';
    case 2:
      return 'Bon état';
    case 3:
      return 'État moyen';
    case 4:
      return 'Mauvais état';
    case 5:
      return 'Révision à faire';
    default:
      return 'Condition inconnue';
  }
};

const proceedToNextStep = () => {
  store.commit('setSelectedTruck', selectedTruck.value); // Commit the selected truck object
  router.push({name: 'DonationsReviewAndConfirmTour'});
};

onMounted(() => {
  fetchAvailableTrucks();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="header-section">
      <h1>Choisir un Camion</h1>
      <button
          class="ui teal button"
          @click="proceedToNextStep"
          :disabled="!selectedTruck"
      >
        Continuer
      </button>
    </div>

    <div v-if="trucks.length > 0">
      <h2>Camions disponibles aujourd'hui</h2>
      <table class="ui celled table full-width-table">
        <thead>
        <tr>
          <th></th>
          <th>Immatriculation</th>
          <th>Modèle</th>
          <th>Capacité (m³)</th>
          <th>État</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="truck in trucks" :key="truck.Truck_ID">
          <td>
            <input
                type="radio"
                :value="truck"
                v-model="selectedTruck"
            />
          </td>
          <td>{{ truck.Registration }}</td>
          <td>{{ truck.Model }}</td>
          <td>{{ truck.Capacity }}</td>
          <td>{{ getConditionText(truck.Conditions) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Aucun camion disponible pour aujourd'hui.</p>
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ui.celled.table.full-width-table {
  width: 100%;
}
</style>
