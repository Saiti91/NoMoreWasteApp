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
    requests.value = response.data;
    console.log('Fetched Requests:', requests.value);
  } catch (error) {
    console.error('Error fetching requests:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la récupération des demandes.',
    });
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
  if (store.getters.selectedAddresses.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Aucune adresse sélectionnée',
      text: 'Veuillez sélectionner au moins une adresse pour créer une tournée.',
    });
    return;
  }

  const selectedDestinations = requests.value.filter(address =>
      store.getters.isAddressSelected(address.Address_ID)
  ).map(address => ({
    Address_ID: address.Address_ID,
    Street: address.Street,
    Postal_Code: address.Postal_Code,
    City: address.City,
    Donors: address.Users,
    Country: address.Country,
    State: address.State,
    Requests: address.Products.map(request => ({
      Request_ID: request.Request_ID,
      Product_Name: request.Product_Name,
      Quantity: request.Quantity
    }))
  }));

  console.log('Selected Destinations:', selectedDestinations); // Added log

  try {
    store.dispatch('saveTourData', selectedDestinations);
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
          :disabled="store.getters.selectedAddresses.length === 0"
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
          <th>Produits</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="address in requests" :key="address.Address_ID">
          <td>
            <input
                type="checkbox"
                :checked="store.getters.isAddressSelected(address.Address_ID)"
                @change="toggleAddressSelection(address.Address_ID)"
            />
          </td>
          <td>
            <strong>{{ address.Street }}, {{ address.Postal_Code }} {{ address.City }},
              {{ address.Country }}</strong><br>
          </td>
          <td>
            <table class="nested-table">
              <tbody>
              <tr v-for="(request, index) in address.Products" :key="index">
                <td>{{ request.Product_Name }}</td>
                <td>{{ request.Quantity }}</td>
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
