<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HeaderBackOffice from '@/components/HeaderBackOffice.vue';
import Swal from 'sweetalert2';
import axios from '@/utils/Axios.js';

const store = useStore();
const router = useRouter();

const selectedTruck = computed(() => store.getters.selectedTruck);
const selectedDestinations = computed(() => store.getters.selectedProducts);

// Define the getConditionText function
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
    const tourData = {
      Date: new Date().toISOString().split('T')[0], // Assuming today’s date for simplicity
      User_ID: null, // Assuming you have a getter for the current user ID
      Truck_ID: store.getters.selectedTruck.Truck_ID,
      Type: true, // Assuming 'true' for a 'collect' type tour, change as needed
      Destinations: selectedDestinations.value.map(destination => ({
        Address_ID: destination.Address_ID,
        Products: destination.Products.map(product => ({
          Product_ID: product.Product_ID,
          Quantity: product.Quantity,
        }))
      }))
    };

    // Post request to create the tour
    const response = await axios.post('/tours', tourData);

    Swal.fire({
      icon: 'success',
      title: 'Tournée créée avec succès',
      text: 'La tournée a été créée et enregistrée.',
    });

    store.dispatch('clearTourData');
    router.push({ name: 'donations' });

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

    <div v-if="selectedTruck && selectedDestinations.length">
      <h2>Détails de la Tournée</h2>

      <div class="ui segment">
        <h3>Camion Sélectionné</h3>
        <p><strong>Immatriculation:</strong> {{ selectedTruck.Registration }}</p>
        <p><strong>Modèle:</strong> {{ selectedTruck.Model }}</p>
        <p><strong>Capacité:</strong> {{ selectedTruck.Capacity }} m³</p>
        <p><strong>État:</strong> {{ getConditionText(selectedTruck.Conditions) }}</p>
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
          <tr v-for="destination in selectedDestinations" :key="destination.Address_ID">
            <td>
              <strong>{{ destination.Street }}, {{ destination.Postal_Code }} {{ destination.City }}, {{ destination.Country }}</strong><br>
              <div>Total Donations: {{ destination.Total_Donations }}</div>
              <div>Total Quantity: {{ destination.Total_Quantity }}</div>
            </td>
            <td>{{ destination.Donors }}</td>
            <td colspan="2">
              <table class="nested-table">
                <tbody>
                <tr v-for="(product, index) in destination.Products" :key="index">
                  <td>{{ product.Product_Name }}</td>
                  <td>{{ product.Quantity }}</td>
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
        <button class="ui teal button" @click="confirmTour">Confirmer la Tournée</button>
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
