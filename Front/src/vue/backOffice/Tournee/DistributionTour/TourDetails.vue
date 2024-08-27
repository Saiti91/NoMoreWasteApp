<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderBackOffice from '@/components/HeaderBackOffice.vue';
import axios from '@/utils/Axios.js';
import Swal from 'sweetalert2';
import { useI18n } from 'vue-i18n';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const tourDetails = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchTourDetails = async () => {
  try {
    const response = await axios.get(`/tours/${route.params.id}`);
    tourDetails.value = response.data;
    console.log('Tour Details:', tourDetails.value);
    loading.value = false;
  } catch (err) {
    error.value = 'Erreur lors de la récupération des détails de la tournée.';
    console.error('Error fetching tour details:', err);
    loading.value = false;
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.value,
    });
  }
};

const deleteTour = async () => {
  try {
    await axios.delete(`/tours/${route.params.id}`);
    Swal.fire({
      icon: 'success',
      title: 'Supprimé',
      text: 'La tournée a été supprimée avec succès.',
    });
    router.push({ name: 'DistributionTourAdmin' });
  } catch (err) {
    console.error('Error deleting tour:', err);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la suppression de la tournée.',
    });
  }
};

const generatePDF = () => {
  const doc = new jsPDF();

  doc.text('Détails de la Tournée', 10, 10);
  doc.text(`Date: ${new Date(tourDetails.value.Route_Date).toLocaleDateString('fr-FR')}`, 10, 20);
  doc.text(`Heure: ${tourDetails.value.Route_Time}`, 10, 30);
  doc.text(`Chauffeur: ${tourDetails.value.Driver?.Driver_Name || 'Pas de conducteur inscrit'}`, 10, 40);
  doc.text(`Camion: ${tourDetails.value.Truck.Truck_Model} (${tourDetails.value.Truck.Truck_Registration})`, 10, 50);

  doc.text('Destinations:', 10, 60);
  const destinations = tourDetails.value.Destinations.map(destination => [
    `${destination.Address.Street}, ${destination.Address.City}`,
    destination.Products.map(product => `${product.Product_Name} - Quantité: ${product.Quantity}`).join(', ')
  ]);

  doc.autoTable({
    head: [['Adresse', 'Produits']],
    body: destinations,
    startY: 70,
  });

  doc.save(`Tournee_${route.params.id}.pdf`);
};

onMounted(() => {
  fetchTourDetails();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="header-actions">
      <h1>Détails de la Tournée</h1>
      <div>
        <button class="ui red button" @click="deleteTour">Supprimer la Tournée</button>
        <button class="ui teal button" @click="generatePDF">Générer le PDF</button>
      </div>
    </div>

    <div v-if="loading">Chargement...</div>

    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div class="ui segment">
        <h3>Informations Générales</h3>
        <p><strong>Date:</strong> {{ new Date(tourDetails.Route_Date).toLocaleDateString('fr-FR') }}</p>
        <p><strong>Heure:</strong> {{ tourDetails.Route_Time }}</p>
        <p><strong>Chauffeur:</strong>
          <span v-if="tourDetails.Driver && tourDetails.Driver.Driver_Name">
            {{ tourDetails.Driver.Driver_Name }}
          </span>
          <span v-else>
            Pas de conducteur inscrit
          </span>
        </p>
        <p><strong>Camion:</strong> {{ tourDetails.Truck.Truck_Model }} ({{ tourDetails.Truck.Truck_Registration }})</p>
      </div>

      <div class="ui segment">
        <h3>Destinations</h3>
        <table class="ui celled table full-width-table">
          <thead>
          <tr>
            <th>Adresse</th>
            <th>Produits</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="destination in tourDetails.Destinations" :key="destination.Destination_ID">
            <td>{{ destination.Address.Street }}, {{ destination.Address.City }}</td>
            <td>
              <ul>
                <li v-for="product in destination.Products" :key="product.Product_ID">
                  {{ product.Product_Name }} - Quantité: {{ product.Quantity }}
                </li>
              </ul>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <button class="ui button" @click="router.push({ name: 'DistributionTourAdmin' })">Retour aux Tournées</button>
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

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}

.ui.red.button:hover {
  background-color: #c82323;
}

.ui.teal.button {
  background-color: #00b5ad;
  color: white;
}

.ui.teal.button:hover {
  background-color: #009c9a;
}
</style>
