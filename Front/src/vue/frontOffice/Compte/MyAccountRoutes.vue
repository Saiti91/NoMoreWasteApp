<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute, useRouter } from 'vue-router';
import Header from "@/components/HeaderFrontOffice.vue";
import UserMenuFO from "@/components/UserDetailsLeftMenuFO.vue";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n';

const t = useI18n().t;
const tours = ref([]);
const route = useRoute();
const router = useRouter();

const fetchUserTours = async () => {
  try {
    const response = await axios.get(`/tours/users/${route.params.id}`);
    tours.value = response.data;
  } catch (error) {
    console.error('Error fetching user tours:', error);
  }
};

const formatDate = (date) => {
  if (!date) return t('noInfo');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

const goToDetails = (tourId) => {
  router.push({ name: 'MyAccountRoutesDetails', params: { id: tourId } });
};

onMounted(() => {
  fetchUserTours();
});
</script>

<template>
  <Header />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenuFO />
      <div class="content-area">
        <h2>{{ t('tourDetailsFO') }}</h2>
        <div v-if="Object.keys(tours).length > 0" class="user-details">
          <table class="ui celled table full-width-table">
            <thead>
            <tr>
              <th>{{ t('tourDate') }}</th>
              <th>{{ t('camion') }}</th>
              <th>{{ t('destinations') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="tour in tours" :key="tour.Route_ID" class="clickable-row" @click="goToDetails(tour.Route_ID)">
              <td>{{ formatDate(tour.Route_Date) }}</td>
              <td>{{ tour.Truck.Truck_Model }} ({{ tour.Truck.Truck_Registration }})</td>
              <td>
                <ul>
                  <li v-for="destination in tour.Destinations" :key="destination.Destination_ID">
                    {{ destination.Address.Street }}, {{ destination.Address.City }}
                  </li>
                </ul>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>{{ t('noTourMsgFO') }}</p>
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
  margin-left: 50px; /* Match this with the actual width of the menu */
  width: calc(70% - 50px); /* Ensure this calculation takes into account the menu's width */
}

.user-details {
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

.ui.celled.table tr.clickable-row {
  cursor: pointer;
}

.ui.celled.table tr.clickable-row:hover {
  background-color: #f1f1f1;
}

.ui.celled.table.full-width-table th,
.ui.celled.table.full-width-table td {
  text-align: center;
  padding: 10px;
}

p {
  font-size: 1.2em;
  color: #666;
}

</style>