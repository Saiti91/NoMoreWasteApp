<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const donnations = ref([]);
const distinctDonations = ref([]);
const router = useRouter();

const fetchDonations = async () => {
  try {
    const response = await axios.get('/donations');
    donnations.value = response.data;
    console.log(donnations.value);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
};

const goToDetails = (donationId) => {
  router.push({ name: 'DonationDetails', params: { id: donationId } });
};
const goToUserDetails = (user_id) => {
  router.push({ name: 'UserDetails', params: { id: user_id } });
};


onMounted(() => {
  fetchDonations();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Donations Admin</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>Nom du produit</th>
        <th>Quantité</th>
        <th>Type de stockage</th>
        <th>Email du donneur</th>
        <th>Email du receveur</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="donation in donnations" :key="donation.Donation_ID" class="clickable-row" >
        <td @click="goToDetails(donation.Donation_ID)">
          {{ donation.Product.Name }}
        </td>
        <td @click="goToDetails(donation.Donation_ID)">
          {{ donation.Quantity }}
        </td>
        <td @click="goToDetails(donation.Donation_ID)">
          {{ donation.Product.Storage_Type }}
        </td>
        <td @click="goToUserDetails(donation.Donor_User.User_ID)">
          {{ donation.Donor_User.Email }}
        </td>
        <td @click="goToUserDetails(donation.Recipient_User?.User_ID)">
          {{ donation.Recipient_User ? donation.Recipient_User.Email : 'En attente' }}
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
