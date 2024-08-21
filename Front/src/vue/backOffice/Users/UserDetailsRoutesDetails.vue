<script setup>
import {onMounted, ref} from 'vue';
import axios from '@/utils/Axios.js';
import {useRoute} from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import UserMenu from "@/components/UserDetailsLeftMenu.vue";
import { useI18n } from 'vue-i18n';

const t = useI18n().t;
const tour = ref(null);
const route = useRoute();

const fetchTourDetails = async () => {
  try {
    const response = await axios.get(`/tours/${route.params.id}`);
    tour.value = response.data;
  } catch (error) {
    console.error('Error fetching tour details:', error);
  }
};

const formatDate = (date) => {
  if (!date) return t('noInfo')
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(date).toLocaleDateString('fr-FR', options);
};

const getTourType = (type) => {
  return type === 1 ? t('collect') : t('retail');
};

onMounted(() => {
  fetchTourDetails();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenu/>
      <div class="content-area">
        <h2>{{ t('detailsOfThe') }} {{ getTourType(tour?.Route_Type) }} {{ t('from') }} {{ formatDate(tour?.Route_Date) }}</h2>
        <div v-if="tour && tour.Destinations.length > 0" class="tour-details">
          <table class="ui celled table full-width-table">
            <thead>
            <tr>
              <th>{{ t('address') }}</th>
              <th>{{ t('product') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="destination in tour.Destinations" :key="destination.Destination_ID">
              <td>
                {{ destination.Address.Street }}, {{ destination.Address.City }}, {{ destination.Address.Postal_Code }},
                {{ destination.Address.Country }}
              </td>
              <td>
                <ul v-if="destination.Products.length > 0">
                  <li v-for="product in destination.Products" :key="product.Destination_Product_ID">
                    {{ product.Product_Name }} ({{ product.Quantity }} {{ t('unités') }})
                  </li>
                </ul>
                <p v-else>{{ t('noProductAssociated') }}</p>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>{{ t('noDestinationFoundTour') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  margin: 20px 0;
}

.content-area {
  padding: 20px;
  margin-left: 50px;
  width: calc(70% - 50px);
}

.tour-details {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
}

h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #4a4a4a;
}

.ui.celled.table.full-width-table {
  width: 100%;
}

.ui.celled.table.full-width-table th {
  text-align: center;
  padding: 10px;
}


.ui.celled.table.full-width-table td {
  padding: 10px;
}

p {
  font-size: 1.2em;
  color: #666;
}
</style>
