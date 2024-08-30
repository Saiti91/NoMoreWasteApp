<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import Header from "@/components/HeaderFrontOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';
import useAuth from "@/components/Auth/useAuth.js";

const { t } = useI18n();
const selectedCategory = ref('all');
const searchQuery = ref('');
const products = ref([]);
const cart = ref([]);
const categories = ref([]);
const { userId, isAuthenticated } = useAuth();

// Récupération des produits du stock
const fetchProducts = async () => {
  try {
    const response = await axios.get('/stocks');
    products.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
  }
};

// Récupération des catégories depuis /productsCategories
const fetchCategories = async () => {
  try {
    const response = await axios.get('/productsCategories');
    categories.value = response.data.map(category => category.Name);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
  }
};

// Filtrer les produits par rapport aux catégories
const filteredProducts = computed(() => {
  let filtered = products.value;
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.Category_Name === selectedCategory.value);
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
      // Réduire la quantité au maximum disponible et afficher une alerte SweetAlert
      existingItem.quantity = product.Quantity;
      Swal.fire({
        icon: 'warning',
        title: t('caution'),
        text: `${t('quantity_max_error')} ${product.Quantity}.`
      });
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
  } else {
    // Réduire la quantité au maximum disponible et afficher une alerte SweetAlert
    item.quantity = product.Quantity;
    Swal.fire({
      icon: 'warning',
      title: t('caution'),
      text: `${t('quantity_max_error')} ${product.Quantity}.`
    });
  }
};

// Diminuer la quantité d'un produit dans la "liste de course"
const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
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
    // Réduire la quantité au maximum disponible et afficher une alerte SweetAlert
    Swal.fire({
      icon: 'warning',
      title: t('caution'),
      text: `${t('quantity_max_error')} ${product.Quantity}.`
    });
  }
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter(cartItem => cartItem.Product_ID !== item.Product_ID);
};

const validateOrder = async () => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Formater la date en YYYY-MM-DD

    // Pour chaque produit dans le panier, créer une demande
    for (const item of cart.value) {
      const requestData = {
        Product_ID: item.Product_ID,
        Quantity: item.quantity,
        Date: currentDate,
        User_ID: userId.value
      };
      const response = await axios.post('/requests', requestData);
      if (response.status !== 201) {
        throw new Error(`Erreur lors de l'enregistrement du produit ${item.Name}`);
      }
    }
    Swal.fire({
      icon: 'success',
      title: t('orderSuccess'),
      text: t('orderSuccessMessage')
    });
  } catch (error) {
    console.error('Erreur lors de la validation de la demande :', error);
    Swal.fire({
      icon: 'error',
      title: t('orderError'),
      text: t('orderErrorMessage')
    });
  }
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});
</script>

<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="new_spacer">
    <div v-if="!isAuthenticated" class="centered-message">
      <i class="user icon"></i>
      <p>{{ t('pleaseLogin') }}</p>
    </div>
    <div  v-else class="ui grid">
    <!-- Menu des catégories -->
    <div class="three wide column">
      <div class="ui vertical fluid tabular menu">
        <a class="item"
           :class="{ active: selectedCategory === 'all' }"
           @click="selectCategory('all')">
          {{ t('all_products') }}
        </a>
        <a v-for="category in categories"
           :key="category" class="item"
           :class="{ active: selectedCategory === category }"
           @click="selectCategory(category)">
          {{ category }}
        </a>
      </div>
    </div>

    <!-- Catalogue de produits -->
    <div class="eight wide column">
      <div class="ui input right floated">
        <input type="text" :placeholder="t('search')" v-model="searchQuery" />
      </div>
      <div class="ui two stackable cards">
        <div v-for="product in filteredProducts" :key="product.Product_ID" class="card product-card">
          <div class="content">
            <div class="header">{{ product.Name }}</div>
            <div class="meta">{{ t('estimated_stock') }} {{ product.Quantity }}</div>
            <div class="meta">{{ t('category') }}: {{ product.Category_Name }}</div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.spacer_perso {
  margin-top: 4.5%;
}

.new_spacer {
  margin-top: 5%;
}

.ui.grid {
  padding: 20px;
}

.product-card {
  width: calc(40% - 10px); /* Réduire la largeur des cartes */
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

.centered-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh; /* S'assure que le message est centré verticalement sur la page */
  text-align: center;
}

.centered-message i.icon {
  font-size: 4em; /* Agrandir l'icône */
  color: #555; /* Couleur de l'icône */
}

.centered-message p {
  font-size: 2em; /* Agrandir le texte */
  color: #555; /* Couleur du texte */
  margin-top: 20px; /* Espacement entre l'icône et le texte */
}
</style>
