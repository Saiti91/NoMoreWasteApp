<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const categories = ref([]);
const router = useRouter();

// Champs pour le formulaire de création de catégorie
const newCategoryName = ref('');
const newDiplomaId = ref('');
const errorMessage = ref(null);

// Fonction pour récupérer les catégories existantes
const fetchCategories = async () => {
  try {
    const response = await axios.get('/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Fonction pour supprimer une catégorie
const deleteCategory = async (categorieId) => {
  try {
    await axios.delete(`/categories/${categorieId}`);
    categories.value = categories.value.filter(category => category.Category_ID !== categorieId);
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};

// Fonction pour aller à la page de détails d'une catégorie
const goToDetails = (categorieId) => {
  router.push({ name: 'CategoriesDetails', params: { id: categorieId } });
};

// Fonction pour ajouter une nouvelle catégorie
const addCategory = async () => {
  errorMessage.value = null;
  try {
    const response = await axios.post('/categories', {
      name: newCategoryName.value,
      diploma_id: newDiplomaId.value,
    });

    // Vérifiez la réponse du serveur pour obtenir l'ID inséré
    const insertId = response.data.insertId;
    if (insertId) {
      categories.value.push({
        Category_ID: insertId,
        Name: newCategoryName.value,
        Diploma_ID: newDiplomaId.value
      });

      // Réinitialiser le formulaire après l'ajout
      newCategoryName.value = '';
      newDiplomaId.value = '';
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'ajout de la catégorie';
    console.error('Error adding category:', error);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>{{ t('categories') }}</h1>

    <!-- Formulaire pour ajouter une nouvelle catégorie -->
    <form @submit.prevent="addCategory" class="ui form add-category-form">
      <div class="field">
        <label>{{ t('nomCategorie') }}</label>
        <input v-model="newCategoryName" type="text" placeholder="Nom de la catégorie" required />
      </div>
      <div class="field">
        <label>{{ t('diplomaId') }}</label>
        <input v-model="newDiplomaId" type="number" placeholder="Diploma ID" required />
      </div>
      <button type="submit" class="ui green button">
        {{ t('ajouterCategorie') }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>

    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>{{ t('idCategorie') }}</th>
        <th>{{ t('nom') }}</th>
        <th>{{ t('actions') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="categorie in categories" :key="categorie.Category_ID" class="clickable-row">
        <td @click="goToDetails(categorie.Category_ID)">{{ categorie.Category_ID }}</td>
        <td @click="goToDetails(categorie.Category_ID)">{{ categorie.Name }}</td>
        <td>
          <button @click="deleteCategory(categorie.Category_ID)" class="ui red button">
            {{ t('supprimer') }}
          </button>
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

.ui.green.button {
  background-color: #21ba45;
  color: white;
  margin-bottom: 20px;
}

.ui.green.button:hover {
  background-color: #2ecc40;
}

.add-category-form {
  margin-bottom: 30px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
