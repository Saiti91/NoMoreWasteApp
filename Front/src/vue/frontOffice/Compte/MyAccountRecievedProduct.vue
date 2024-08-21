<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute, useRouter } from 'vue-router';
import Header from "@/components/HeaderFrontOffice.vue";
import UserMenuFO from "@/components/UserDetailsLeftMenuFO.vue";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n';


const user = ref(null);
const t = useI18n().t;
const donations = ref([]);
const route = useRoute();

const fetchUserDonations = async () => {
  try {
    const response = await axios.get(`/requests/user/${route.params.id}`);
    donations.value = response.data;
  } catch (error) {
    console.error('Error fetching user donations:', error);
  }
};

const formatDate = (date) => {
  if (!date) return t('noInfo');
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(date).toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  fetchUserDonations();
});
</script>

<template>
  <Header />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenuFO />
      <div class="content-area">
      <h2>{{ t('receivedDonationTitleFO') }}</h2>
      <div v-if="Object.keys(donations).length > 0" class="user-details">
        <table class="ui celled table full-width-table">
          <thead>
          <tr>
            <th>{{ t('productName') }}</th>
            <th>{{ t('codeBarre') }}</th>
            <th>{{ t('quantité') }}</th>
            <th>{{ t('date') }}</th>
            <th>{{ t('category') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="donation in donations" :key="donation.Request_ID">
            <td>{{ donation.Product_Name }}</td>
            <td>{{ donation.Barcode }}</td>
            <td>{{ donation.Quantity }}</td>
            <td>{{ formatDate(donation.Date) }}</td>
            <td>{{ donation.Category_Name }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>{{ t('noDonationFoundFO') }}</p>
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
