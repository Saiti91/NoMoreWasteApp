<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const categories = ref([]);
const distinctProducts = ref([]);
const router = useRouter();

const fetchCategories = async () => {
  try {
    const response = await axios.get('/categories');
    categories.value = response.data;

  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const goToDetails = (categorieId) => {
  router.push({ name: 'CategoriesDetails', params: { id: categorieId } });
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Categories</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('idCategorie') }}</th>
        <th>{{ t('nom') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="categorie in categories" :key="categorie.Category_ID" class="clickable-row" @click="goToDetails(categorie.Category_ID)">
        <td>{{ categorie.Category_ID }}</td>
        <td>{{ categorie.Name }}</td>
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
