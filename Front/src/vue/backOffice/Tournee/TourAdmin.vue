<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const tours = ref([]);
const router = useRouter();

const fetchDonations = async () => {
  try {
    const response = await axios.get('/tours');
    tours.value = response.data;
    console.log(tours.value);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
};

onMounted(() => {
  fetchDonations();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Tours Admin</h1>

  </div>
</template>


<style scoped>
.spacer {
  margin: 20px 0;
}
</style>
