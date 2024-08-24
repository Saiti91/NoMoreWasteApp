<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";

const recipe = ref({
  title: '',
  instructions: '',
  image: null,
});

const ingredients = ref([
  { name: '', selectedProductId: null, quantity: '', unit: '' },
]);

const products = ref([]);
const filteredProducts = ref([[]]);

const units = ref(['grammes', 'ml', 'pièce', 'cuillère à soupe','au goût']);

const fetchProducts = async () => {
  try {
    const response = await axios.get('/stocks');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const handleImageUpload = (event) => {
  recipe.value.image = event.target.files[0];
};

const addIngredient = () => {
  ingredients.value.push({ name: '', selectedProductId: null, quantity: '', unit: '' });
  filteredProducts.value.push([]);
};

const removeIngredient = (index) => {
  ingredients.value.splice(index, 1);
  filteredProducts.value.splice(index, 1);
};

const filterProducts = (index) => {
  const query = ingredients.value[index].name.toLowerCase();
  filteredProducts.value[index] = products.value
      .filter(product => product.Name.toLowerCase().includes(query))
      .slice(0, 10); // Limit to 10 results
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append('name', recipe.value.title);
  formData.append('instructions', recipe.value.instructions);
  if (recipe.value.image) {
    formData.append('image', recipe.value.image);
  }
  ingredients.value.forEach((ingredient, index) => {
    formData.append(`ingredients[${index}][product_id]`, ingredient.selectedProductId);
    formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    formData.append(`ingredients[${index}][unit]`, ingredient.unit);
  });

  // Log FormData values
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  try {
    const response = await axios.post('/recipes/add', formData);
    console.log('Recipe created:', response.data);
  } catch (error) {
    console.error('Error creating recipe:', error.response.data || error.message);
  }
};


onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="content-container">
    <h1>Ajouter une recette</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="recipeImage">Image</label>
        <input type="file" id="recipeImage" @change="handleImageUpload" />
      </div>

      <div class="form-group">
        <label for="recipeTitle">Titre</label>
        <input type="text" id="recipeTitle" v-model="recipe.title" required />
      </div>

      <div v-for="(ingredient, index) in ingredients" :key="index" class="form-group">
        <label>Ingrédient {{ index + 1 }}</label>
        <input type="text" v-model="ingredient.name" @input="filterProducts(index)" placeholder="Commencez à taper un produit..." />
        <select v-if="filteredProducts[index].length > 0" v-model="ingredient.selectedProductId">
          <option v-for="product in filteredProducts[index]" :key="product.Product_ID" :value="product.Product_ID">
            {{ product.Name }} ({{ product.Quantity }} {{ product.Unit }})
          </option>
        </select>
        <input type="text" v-model="ingredient.quantity" placeholder="Quantité" />
        <select v-model="ingredient.unit">
          <option disabled value="">Sélectionnez l'unité</option>
          <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
        </select>
        <button type="button" @click="removeIngredient(index)" class="remove-ingredient">Retirer</button>
      </div>

      <button type="button" @click="addIngredient">+ Ajouter un ingrédient</button>

      <div class="form-group">
        <label for="recipeInstructions">Description</label>
        <textarea id="recipeInstructions" v-model="recipe.instructions" rows="5" required></textarea>
      </div>

      <button type="submit" class="submit-button">Enregistrer la recette</button>
    </form>
  </div>
</template>

<style scoped>
.content-container {
  width: 80%;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="file"],
select,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-ingredient,
.remove-ingredient {
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.remove-ingredient {
  background-color: #dc3545;
  margin-left: 10px;
}

.add-ingredient:hover,
.remove-ingredient:hover {
  opacity: 0.8;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
