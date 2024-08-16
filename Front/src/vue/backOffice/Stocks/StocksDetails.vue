<script setup>
import {onMounted, ref} from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const donations = ref([]);
const productName = ref('');
const router = useRouter();
const route = useRoute();

const fetchDonations = async () => {
  try {
    const productId = route.params.id; // Récupérer le paramètre de l'URL
    const response = await axios.get(`/donations/product/${productId}`);
    donations.value = response.data;
    if (donations.value.length > 0) {
      productName.value = donations.value[0].Name;
    }
    console.log('Donations:', donations.value);
    console.log('Product Name:', productName.value);
  } catch (error) {
    console.error('Error fetching donations:', error);
  }
};

const formatDate = (dateString) => {
  const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchDonations();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>{{ t('différenteDonationsDe') }} {{ productName }}</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('donationid') }}</th>
        <th>{{ t('donorname') }}</th>
        <th>{{ t('donoremail')}}</th>
        <th>{{ t('quantité') }}</th>
        <th>{{ t('date') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="donation in donations" :key="donation.Donation_ID">
        <td>{{ donation.Donation_ID }}</td>
        <td>{{ donation.Donor_Name }} {{ donation.Donor_Firstname }}</td>
        <td>{{ donation.Donor_Email }}</td>
        <td>{{ donation.Quantity }}</td>
        <td>{{ formatDate(donation.Date) }}</td>
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
</style>
