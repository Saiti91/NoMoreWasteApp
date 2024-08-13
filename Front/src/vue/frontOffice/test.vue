<template>
  <div>
    <h1>Liste des Catégories</h1>
    <ul>
      <li v-for="category in categories" :key="category.Category_ID">
        {{ category.Name }}
      </li>
    </ul>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: [],
      error: null,
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('/api/categories'); // Assurez-vous que l'URL correspond à votre API
        this.categories = response.data;
      } catch (err) {
        this.error = 'Erreur lors de la récupération des catégories.';
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles personnalisés si nécessaire */
</style>
