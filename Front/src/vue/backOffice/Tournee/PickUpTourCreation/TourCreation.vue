<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from '@/components/HeaderBackOffice.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import Swal from 'sweetalert2'; // Importer SweetAlert2

const { t } = useI18n();
const donations = ref([]);
const store = useStore(); // Accès au store Vuex
const router = useRouter();

const fetchDonations = async () => {
  try {
    const response = await axios.get('/donations/notcollected');
    donations.value = response.data;
    console.log('Fetched Donations:', donations.value);
  } catch (error) {
    console.error('Error fetching donations:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la récupération des donations.',
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

  // Filter and map the selected destinations, including full address details and products
  const selectedDestinations = donations.value.filter(address =>
      store.getters.isAddressSelected(address.Address_ID)
  ).map(address => ({
    Address_ID: address.Address_ID,
    Street: address.Street,
    Postal_Code: address.Postal_Code,
    City: address.City,
    Country: address.Country,
    State: address.State,
    Donors: address.Donors,
    Total_Donations: address.Total_Donations,
    Total_Quantity: address.Total_Quantity,
    Products: address.Products.map(product => ({
      Donation_ID: product.Donation_ID,
      Product_Name: product.Product_Name,
      Quantity: product.Quantity
    }))
  }));

  // Save the selected destinations and their products, including address details, in the store
  store.dispatch('saveTourData', selectedDestinations);

  try {
    store.commit('clearAddresses');
    router.push({ name: 'DonationsSelectTruck' });
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
  fetchDonations();
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

    <div v-if="donations.length > 0">
      <table class="ui celled table full-width-table">
        <thead>
        <tr>
          <th></th>
          <th>Adresse</th>
          <th>Donneur</th>
          <th colspan="2">Produits</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="address in donations" :key="address.Address_ID">
          <td>
            <input
                type="checkbox"
                :checked="store.getters.isAddressSelected(address.Address_ID)"
                @change="toggleAddressSelection(address.Address_ID)"
            />
          </td>
          <td>
            <strong>{{ address.Street }}, {{ address.Postal_Code }} {{ address.City }}, {{ address.Country }}</strong><br>
            <div>Total Donations: {{ address.Total_Donations }}</div>
            <div>Total Quantity: {{ address.Total_Quantity }}</div>
          </td>
          <td>{{ address.Donors }}</td>
          <td colspan="2">
            <table class="nested-table">
              <tbody>
              <tr v-for="(product, index) in address.Products" :key="index">
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
    <div v-else>
      <p>Aucune donation disponible.</p>
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
