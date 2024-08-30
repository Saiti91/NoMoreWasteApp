<script setup>
import {onMounted, ref} from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import router from "@/routers/Router.js";
import {useI18n} from 'vue-i18n';

const t = useI18n().t;
const recipes = ref([]);

const getImageUrl = (recipeId) => {
  return `${axios.defaults.baseURL}/uploads/recipes/${recipeId}.jpg`;
};

// Function to format quantity
const formatQuantity = (quantity) => {
  if (quantity === null) return '';
  const num = parseFloat(quantity);
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
};

// Function to handle adding a new recipe
const addRecipe = () => {
  router.push('/recipes-admin-add');
};

const fetchRecipes = async () => {
  try {
    const response = await axios.get('/recipes');
    recipes.value = response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
};

onMounted(() => {
  fetchRecipes();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="content-container">
    <div class="header-row">
      <h1>{{ t('allRecipes') }}</h1>
      <button class="add-recipe-button" @click="addRecipe">{{ t('addRecipe') }}</button>
    </div>
    <div class="recipe-list">
      <div v-for="recipe in recipes" :key="recipe.Recipes_ID" class="recipe-card">
        <img :src="getImageUrl(recipe.Recipes_ID)" alt="Recipe Image" class="recipe-image"/>
        <div class="recipe-details">
          <h2>{{ recipe.Name }}</h2>
          <ul class="ingredients-list">
            <li v-for="ingredient in recipe.Ingredients" :key="ingredient.Product_ID">
              {{ formatQuantity(ingredient.Quantity) }} {{ t('unit') }} {{ ingredient.Name }}
            </li>
          </ul>
          <p class="instructions">{{ recipe.Instructions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-container {
  width: 80%;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.recipe-card {
  display: flex;
  align-items: flex-start;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  gap: 20px;
  max-width: 100%;
}

.recipe-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.recipe-details {
  flex: 1;
}

h1 {
  margin-top: 0;
  color: #333;
}

.add-recipe-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.add-recipe-button:hover {
  background-color: #45a049;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  color: #555;
}

.ingredients-list li {
  margin-bottom: 5px;
}

.instructions {
  color: #777;
  margin-top: 10px;
}
</style>
