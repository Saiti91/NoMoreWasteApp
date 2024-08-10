<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import Header from "@/components/HeaderFrontOffice.vue";

const selectedCategory = ref('all');
const searchQuery = ref('');
const products = ref([]);
const cart = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get('/stocks'); // Remplacez par l'URL de votre API
    products.value = response.data;
    console.log('Produits:', products.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
  }
};

const filteredProducts = computed(() => {
  let filtered = products.value;
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.category === selectedCategory.value);
  }
  if (searchQuery.value) {
    filtered = filtered.filter(product => product.Name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }
  return filtered;
});

const selectCategory = (category) => {
  selectedCategory.value = category;
};

const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.Product_ID === product.Product_ID);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

const incrementQuantity = (item) => {
  item.quantity++;
};

const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    removeFromCart(item);
  }
};

const updateQuantity = (item) => {
  if (item.quantity < 1) {
    removeFromCart(item);
  }
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter(cartItem => cartItem.Product_ID !== item.Product_ID);
};

const validateOrder = () => {
  try {
    // Logique pour valider la demande ici
    console.log('Demande validée avec les produits:', cart.value);
  } catch (error) {
    console.error('Erreur lors de la validation de la demande :', error);
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <Header />
  <div class="spacer"></div>
  <div class="ui grid">
    <!-- Menu des catégories -->
    <div class="two wide column">
      <div class="ui vertical fluid tabular menu">
        <a class="item" :class="{ active: selectedCategory === 'all' }" @click="selectCategory('all')">Tous les produits</a>
        <a class="item" :class="{ active: selectedCategory === 'category1' }" @click="selectCategory('category1')">Catégorie 1</a>
        <a class="item" :class="{ active: selectedCategory === 'category2' }" @click="selectCategory('category2')">Catégorie 2</a>
        <a class="item" :class="{ active: selectedCategory === 'category3' }" @click="selectCategory('category3')">Catégorie 3</a>
        <!-- Ajouter plus de catégories ici -->
      </div>
    </div>

    <!-- Catalogue de produits -->
    <div class="ten wide column">
      <div class="ui input right floated">
        <input type="text" placeholder="Rechercher..." v-model="searchQuery" />
      </div>
      <div class="ui two stackable cards">
        <div v-for="product in filteredProducts" :key="product.Product_ID" class="card product-card">
          <div class="content">
            <div class="header">{{ product.Name }}</div>
            <div class="meta">Stock estimé: {{ product.Quantity }}</div>
            <div class="description">
              <button class="ui button" @click="addToCart(product)">Ajouter au panier</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panier -->
    <div class="four wide column">
      <div class="ui grid">
        <div class="eleven wide column">
          <h3 class="ui header">Panier</h3>
        </div>
        <div class="five wide column right aligned">
          <button class="ui teal button" @click="validateOrder">Valider la demande</button>
        </div>
      </div>

      <div v-for="item in cart" :key="item.Product_ID" class="ui segment">
        <div class="ui grid">
          <div class="eight wide column">
            <strong>{{ item.Name }}</strong>
          </div>
          <div class="eight wide column right aligned">
            <div class="ui input quantity-controls">
              <i class="minus icon" @click="decrementQuantity(item)"></i>
              <input type="number" v-model="item.quantity" @input="updateQuantity(item)" style="width: 60px; text-align: center;">
              <i class="plus icon" @click="incrementQuantity(item)"></i>
              <i class="trash icon" @click="removeFromCart(item)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 1%;
}

.ui.grid {
  padding: 20px;
}

.product-card {
  width: calc(50% - 20px);
  margin-bottom: 20px;
  margin-right: 2.5%;
  float: left;
}

.ui.segment {
  margin-bottom: 10px;
}

.ui.input.right.floated {
  margin-bottom: 20px;
}

.ui.vertical.fluid.tabular.menu .item {
  cursor: pointer;
}

.ui.input.quantity-controls {
  display: flex;
  align-items: center;
}

.ui.input.quantity-controls i.icon {
  margin: 0 5px;
}

.ui.segment {
  padding: 10px;
  width: 100%;
}

.ui.grid > .four.wide.column {
  padding-right: 0;
}
</style>
