<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import Header from "@/components/HeaderFrontOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const selectedCategory = ref('all');
const searchQuery = ref('');
const products = ref([]);
const cart = ref([]);
const categories = ref([]); // Catégories extraites des produits
const errorMessages = ref({}); // Stocke les messages d'erreur pour chaque produit

// Récupération des produits du stock
const fetchProducts = async () => {
  try {
    const response = await axios.get('/stocks');
    products.value = response.data;

    // Extraction des catégories uniques à partir des produits
    categories.value = [...new Set(products.value.map(product => product.Storage_Type))];

    console.log('Produits:', products.value);
    console.log('Catégories:', categories.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
  }
};

// Filtrer les produits par rapport aux catégories
const filteredProducts = computed(() => {
  let filtered = products.value;
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.Storage_Type === selectedCategory.value);
  }
  if (searchQuery.value) {
    filtered = filtered.filter(product => product.Name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }
  return filtered;
});

// Choisir une catégorie
const selectCategory = (category) => {
  selectedCategory.value = category;
};

// Ajouter un produit à la "liste de course"
const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.Product_ID === product.Product_ID);
  if (existingItem) {
    if (existingItem.quantity < product.Quantity) {
      existingItem.quantity++;
    } else {
      // Affiche un message d'erreur si la quantité dépasse le stock disponible
      errorMessages.value[product.Product_ID] = `${t('quantity_max_error')} ${product.Quantity}.`;
    }
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

// Augmenter la quantité d'un produit dans la "liste de course"
const incrementQuantity = (item) => {
  const product = products.value.find(p => p.Product_ID === item.Product_ID);
  if (item.quantity < product.Quantity) {
    item.quantity++;
    errorMessages.value[item.Product_ID] = ''; // Réinitialiser le message d'erreur si la quantité est valide
  } else {
    // Affiche un message d'erreur si la quantité dépasse le stock disponible
    errorMessages.value[item.Product_ID] = `${t('quantity_max_error')} ${product.Quantity}.`;
  }
};

// Diminuer la quantité d'un produit dans la "liste de course"
const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
    errorMessages.value[item.Product_ID] = ''; // Réinitialiser le message d'erreur si la quantité est valide
  } else {
    removeFromCart(item);
  }
};

// Mettre à jour la quantité en direct dans la "liste de course"
const updateQuantity = (item) => {
  const product = products.value.find(p => p.Product_ID === item.Product_ID);
  if (item.quantity < 1) {
    removeFromCart(item);
  } else if (item.quantity > product.Quantity) {
    item.quantity = product.Quantity;
    // Affiche un message d'erreur si la quantité dépasse le stock disponible
    errorMessages.value[item.Product_ID] = `${t('quantity_max_error')} ${product.Quantity}.`;
  } else {
    errorMessages.value[item.Product_ID] = ''; // Réinitialiser le message d'erreur si la quantité est valide
  }
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter(cartItem => cartItem.Product_ID !== item.Product_ID);
  delete errorMessages.value[item.Product_ID]; // Supprimer le message d'erreur associé
};

// Valider la liste
const validateOrder = () => {
  try {
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
        <a class="item" :class="{ active: selectedCategory === 'all' }" @click="selectCategory('all')">{{ t('all_products') }}</a>
        <a v-for="category in categories" :key="category" class="item" :class="{ active: selectedCategory === category }" @click="selectCategory(category)">
          {{ category }}
        </a>
      </div>
    </div>

    <!-- Catalogue de produits -->
    <div class="nine wide column">
      <div class="ui input right floated">
        <input type="text" :placeholder="t('search')" v-model="searchQuery" />
      </div>
      <div class="ui two stackable cards">
        <div v-for="product in filteredProducts" :key="product.Product_ID" class="card product-card">
          <div class="content">
            <div class="header">{{ product.Name }}</div>
            <div class="meta">{{ t('estimated_stock') }} {{ product.Quantity }}</div>
            <div class="description">
              <button class="ui button" @click="addToCart(product)">{{ t('add_list') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panier -->
    <div class="five wide column">
      <div class="ui grid">
        <div class="eleven wide column">
          <h3 class="ui header">{{ t('list') }}</h3>
        </div>
        <div class="five wide column right aligned">
          <button class="ui teal button" @click="validateOrder">{{ t('validate_request') }}</button>
        </div>
      </div>

      <div v-for="item in cart" :key="item.Product_ID" class="ui segment">
        <div class="ui grid">
          <div class="seven wide column">
            <strong>{{ item.Name }}</strong>
          </div>
          <div class="nine wide column right aligned">
            <div class="ui input quantity-controls">
              <i class="minus icon" @click="decrementQuantity(item)"></i>
              <input type="number" v-model="item.quantity" @input="updateQuantity(item)" style="width: 70px; text-align: center;">
              <i class="plus icon" @click="incrementQuantity(item)"></i>
              <i class="trash icon" @click="removeFromCart(item)"></i>
            </div>
            <div v-if="errorMessages[item.Product_ID]" class="ui red message" style="margin-top: 10px;">
              {{ errorMessages[item.Product_ID] }}
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
  width: calc(45% - 10px); /* Réduire la largeur des cartes */
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

.ui.grid > .five.wide.column {
  padding-right: 0;
}

.ui.red.message {
  color: red;
  font-size: 12px;
}
</style>
