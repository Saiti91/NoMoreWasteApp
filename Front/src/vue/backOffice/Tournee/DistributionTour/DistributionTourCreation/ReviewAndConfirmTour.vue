<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HeaderBackOffice from '@/components/HeaderBackOffice.vue';
import Swal from 'sweetalert2';
import axios from '@/utils/Axios.js';

const store = useStore();
const router = useRouter();
const selectedTime = ref(''); // Stocke l'heure sélectionnée

const selectedTruck = computed(() => store.getters.selectedTruck);
const selectedDestinations = computed(() => store.getters.selectedDestinations);

// Propriété pour vérifier si l'heure est sélectionnée
const isTimeSelected = computed(() => selectedTime.value !== '');

// Compute the total donations and quantity for each destination
const computedDestinations = computed(() => {
  return selectedDestinations.value.map(destination => {
    const totalDonations = destination.Requests.length;
    const totalQuantity = destination.Requests.reduce((sum, request) => sum + request.Quantity, 0);

    return {
      ...destination,
      Total_Donations: totalDonations,
      Total_Quantity: totalQuantity,
    };
  });
});

// Ensure selectedTruck and selectedDestinations are properly initialized
onMounted(() => {
  console.log('Selected Truck:', selectedTruck.value); // Added log
  console.log('Computed Destinations:', computedDestinations.value); // Added log

  if (!selectedTruck.value || !selectedDestinations.value) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Veuillez sélectionner un camion et des destinations avant de continuer.',
    });
    router.push({ name: 'RequestsAdmin' });
  }
});

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

const confirmTour = async () => {
  try {
    if (!selectedTruck.value || !computedDestinations.value?.length || !selectedTime.value) {
      throw new Error('Missing truck, destinations data, or time.');
    }

    const tourData = {
      Date: new Date().toISOString().split('T')[0],
      Time: selectedTime.value, // Ajoutez l'heure sélectionnée ici
      User_ID: null,
      Truck_ID: selectedTruck.value.Truck_ID,
      Type: false,
      Destinations: computedDestinations.value.map(destination => ({
        Address_ID: destination.Address_ID,
        Products: destination.Requests.map(request => ({
          Request_ID: request.Request_ID,
          Product_ID: request.Product_ID,
          Quantity: request.Quantity,
        }))
      }))
    };

    console.log('Tour Data:', tourData); // Added log

    const response = await axios.post('/tours', tourData);

    Swal.fire({
      icon: 'success',
      title: 'Tournée créée avec succès',
      text: 'La tournée a été créée et enregistrée.',
    });

    store.dispatch('clearTourData');
    router.push({ name: 'RequestsAdmin' });

  } catch (error) {
    console.error('Error confirming tour:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la création de la tournée.',
    });
  }
};

const cancelTour = () => {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: "Cette action annulera la tournée en cours de création.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, annuler',
    cancelButtonText: 'Non, continuer'
  }).then((result) => {
    if (result.isConfirmed) {
      store.dispatch('clearTourData');
      router.push({ name: 'CreateTour' });
    }
  });
};
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Confirmer la Tournée</h1>

    <div v-if="selectedTruck && computedDestinations?.length">
      <h2>Détails de la Tournée</h2>

      <div class="ui segment">
        <h3>Camion Sélectionné</h3>
        <p><strong>Immatriculation:</strong> {{ selectedTruck?.Registration || 'N/A' }}</p>
        <p><strong>Modèle:</strong> {{ selectedTruck?.Model || 'N/A' }}</p>
        <p><strong>Capacité:</strong> {{ selectedTruck?.Capacity || 'N/A' }} m³</p>
        <p><strong>État:</strong> {{ getConditionText(selectedTruck?.Conditions) }}</p>
      </div>

      <div class="ui segment">
        <h3>Heure de la Tournée</h3>
        <input type="time" v-model="selectedTime" class="ui input"/>
      </div>

      <div class="ui segment">
        <h3>Destinations Sélectionnées</h3>
        <table class="ui celled table full-width-table">
          <thead>
          <tr>
            <th>Adresse</th>
            <th>Donneur</th>
            <th colspan="2">Produits</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="destination in computedDestinations" :key="destination.Address_ID">
            <td>
              <strong>{{ destination?.Street || 'Adresse inconnue' }},
                {{ destination?.Postal_Code || '' }}
                {{ destination?.City || '' }},
                {{ destination?.Country || '' }}</strong><br>
              <div>Total Donations: {{ destination?.Total_Donations || 0 }}</div>
              <div>Total Quantity: {{ destination?.Total_Quantity || 0 }}</div>
            </td>
            <td>{{ destination?.Donors || 'Donneur inconnu' }}</td>
            <td colspan="2">
              <table class="nested-table">
                <tbody>
                <tr v-for="(product, index) in destination?.Requests || []" :key="index">
                  <td>{{ product?.Product_Name || 'Produit inconnu' }}</td>
                  <td>{{ product?.Quantity || 0 }}</td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="ui buttons">
        <button class="ui button" @click="cancelTour">Annuler</button>
        <div class="or"></div>
        <button class="ui teal button" @click="confirmTour" :disabled="!isTimeSelected">Confirmer la Tournée</button>
      </div>
    </div>
    <div v-else>
      <p>Aucun camion ou destination sélectionné.</p>
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

.ui.segment {
  margin-bottom: 20px;
}

.ui.celled.table.full-width-table {
  width: 100%;
}

.nested-table {
  width: 100%;
  border-collapse: collapse;
}

.nested-table td {
  padding: 5px;
  border: none;
  text-align: left;
}
</style>
