<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const requests = ref([]);
const router = useRouter();

const fetchRequests = async () => {
  try {
    const response = await axios.get('/requests');
    requests.value = response.data;
    console.log(requests.value);
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const goToUserDetails = (user_id) => {
  router.push({ name: 'UserDetails', params: { id: user_id } });
};

onMounted(() => {
  fetchRequests();
});
</script>
<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Requests Admin</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>Nom du produit</th>
        <th>Quantité</th>
        <th>Date</th>
        <th>Type de stockage</th>
        <th>Email du demandeur</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="request in requests" :key="request.Request_ID" class="clickable-row">
        <td>
          {{ request.Product.Name }}
        </td>
        <td>
          {{ request.Quantity }}
        </td>
        <td>
          {{ formatDate(request.Date) }}
        </td>
        <td>
          {{ request.Product.Storage_Type }}
        </td>
        <td @click="goToUserDetails(request.User.User_ID)">
          {{ request.User.Email }}
        </td>
      </tr>
      </tbody>
    </table>
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

.ui.celled.table.full-width-table {
  width: 100%;
}

.ui.celled.table tr.clickable-row {
  cursor: pointer;
}

.ui.celled.table tr.clickable-row:hover {
  background-color: #f1f1f1;
}
</style>
