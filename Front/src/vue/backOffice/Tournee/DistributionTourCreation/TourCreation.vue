<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from '@/components/HeaderBackOffice.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

const { t } = useI18n();
const requests = ref([]);
const store = useStore();
const router = useRouter();

const fetchRequests = async () => {
  try {
    const response = await axios.get('/requests/notcollected');
    requests.value = response.data || [];
    console.log('Fetched Requests:', requests.value);
  } catch (error) {
    console.error('Error fetching requests:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la récupération des demandes.',
    });
    requests.value = [];
  }
};

const toggleAddressSelection = (addressId) => {
  if (store.getters.isAddressSelected(addressId)) {
    store.commit('removeAddress', addressId);
  } else {
    store.commit('addAddress', addressId);
  }
};

const createTour = async () => {
  if (!store.getters.selectedAddresses || store.getters.selectedAddresses.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Aucune adresse sélectionnée',
      text: 'Veuillez sélectionner au moins une adresse pour créer une tournée.',
    });
    return;
  }

  const selectedRequests = requests.value
      .filter(group => store.getters.isAddressSelected(group.Address.Address_ID))
      .map(group => ({
        Address: group.Address,
        Requests: group.Requests.map(request => ({
          Request_ID: request.Request_ID,
          Product: request.Product,
          Quantity: request.Quantity,
          Request_Date: request.Request_Date,
          User: request.User
        }))
      }));

  store.dispatch('saveTourData', selectedRequests);

  try {
    store.commit('clearAddresses');
    router.push({ name: 'RequestsSelectTruck' });
  } catch (error) {
    console.error('Error creating tour:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la création de la tournée.',
    });
  }
};

onMounted(() => {
  fetchRequests();
});
</script>
<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="header-section">
      <h1>Créer une Tournée</h1>
      <button
          class="ui teal button"
          @click="createTour"
          :disabled="!store.getters.selectedAddresses || store.getters.selectedAddresses.length === 0"
      >
        {{ t('createTour') }}
      </button>
    </div>

    <div v-if="requests.length > 0">
      <table class="ui celled table full-width-table">
        <thead>
        <tr>
          <th></th>
          <th>Adresse</th>
          <th>Produit</th>
          <th>Quantité</th>
          <th>Demandeur</th>
          <th>Date de Demande</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="group in requests" :key="group.Address.Address_ID">
          <td>
            <input
                type="checkbox"
                :checked="store.getters.isAddressSelected(group.Address.Address_ID)"
                @change="toggleAddressSelection(group.Address.Address_ID)"
            />
          </td>
          <td>
            <strong>{{ group.Address.Street }}, {{ group.Address.Postal_Code }} {{ group.Address.City }}, {{ group.Address.Country }}</strong>
          </td>
          <td colspan="4">
            <table class="nested-table">
              <tbody>
              <tr v-for="(request, index) in group.Requests" :key="index">
                <td>{{ request.Product.Name }}</td>
                <td>{{ request.Quantity }}</td>
                <td>{{ request.User.Name }} {{ request.User.Firstname }}</td>
                <td>{{ new Date(request.Request_Date).toLocaleDateString() }}</td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Aucune demande disponible.</p>
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

.ui.celled.table tr.clickable-row {
  cursor: pointer;
}

.ui.celled.table tr.clickable-row:hover {
  background-color: #f1f1f1;
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
