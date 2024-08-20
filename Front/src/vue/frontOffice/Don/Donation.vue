<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import Header from "@/components/HeaderFrontOffice.vue";
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';

const { t } = useI18n();
const selectedCategory = ref('all');
const searchQuery = ref('');
const products = ref([]);
const donationList = ref([]);
const categories = ref([]);
const token = Cookies.get('token');
const userId = ref(null);

//Récupérer id de l'utilisateur
if (token) {
  try {
    const decodedToken = VueJwtDecode.decode(token);
    const expirationTime = decodedToken.exp * 1000;
    if (Date.now() < expirationTime) {
      userId.value = decodedToken.uid;
    } else {
      Cookies.remove('token');
    }
  } catch (error) {
    console.error('Jeton invalide', error);
    Cookies.remove('token');
  }
}

// Fonction pour générer le code-barres pour les nouveaux produits
function generateBarcode() {
  const randomNumbers = Math.floor(Math.random() * 900) + 100; // Générer un nombre aléatoire à 3 chiffres
  return `${Date.now()}${randomNumbers}`;
}

// Fonction pour obtenir la date actuelle au format YYYY-MM-DD
function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Récupération des catégories depuis /productsCategories
const fetchCategories = async () => {
  try {
    const response = await axios.get('/productsCategories');
    categories.value = response.data.map(category => category.Name);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
  }
};

// Récupération des produits disponibles pour le don
const fetchProducts = async () => {
  try {
    const response = await axios.get('/products');
    products.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
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

// Ajouter un produit à la "liste de dons"
const addToDonationList = (product) => {
  const existingItem = donationList.value.find(item => item.Product_ID === product.Product_ID);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    donationList.value.push({ ...product, quantity: 1 });
  }
};

// Ajouter un produit "autre"
const addOtherProduct = () => {
  const newProduct = {
    Product_ID: Date.now(), // Utiliser un identifiant unique pour le produit "autre"
    Name: '',
    isOther: true, // Marquer ce produit comme étant "autre"
    quantity: 1,
    Category_Name: '',
  };
  donationList.value.push(newProduct);
};

// Mettre à jour la quantité en direct dans la "liste de dons"
const updateQuantity = (item) => {
  if (item.quantity < 1) {
    removeFromDonationList(item);
  }
};

// Supprimer un produit de la "liste de dons"
const removeFromDonationList = (item) => {
  donationList.value = donationList.value.filter(donationItem => donationItem.Product_ID !== item.Product_ID);
};

// Valider la liste des dons
const validateDonation = async () => {
  // Vérifier si un produit "autre" n'a pas de nom ou de catégorie
  const invalidOtherProduct = donationList.value.find(item => item.isOther && (!item.Name.trim() || !item.Category_Name));

  if (invalidOtherProduct) {
    // Afficher une pop-up d'erreur
    Swal.fire({
      icon: 'error',
      title: t('donationError'),
      text: t('errorOtherProductNameCategory'),
    });
    return; // Arrêter la validation si un produit est invalide
  }

  try {
    // Parcourir chaque produit dans la donationList
    for (const item of donationList.value) {
      let productId = item.Product_ID;

      // Si c'est un nouveau produit, l'enregistrer d'abord
      if (item.isOther) {
        const barcode = generateBarcode();
        const newProduct = {
          Barcode: barcode,
          Name: item.Name,
          Category_ID: categories.value.indexOf(item.Category_Name) + 1,
        };
        const productResponse = await axios.post('/products', newProduct);
        productId = productResponse.data.Product_ID;
      }

      // Enregistrer la donation
      const donationData = {
        Product_ID: productId,
        Quantity: item.quantity,
        Donor_User_ID: userId.value,
        Date: getFormattedDate(),
        Route_ID: null,
        Collected: false,
        Collection_Date: null,
      };

      await axios.post('/donations', donationData);
    }
    Swal.fire({
      icon: 'success',
      title: t('donationSuccess'),
      text: t('donationSuccessMessage'),
    });

  } catch (error) {
    console.error('Erreur lors de la validation de la liste des dons :', error);
    Swal.fire({
      icon: 'error',
      title: t('donationError'),
      text: t('donationErrorMessage'),
    });
  }
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>


<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="ui grid">
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
            <div class="meta">{{ t('category') }}: {{ product.Category_Name }}</div>
            <div class="description">
              <button class="ui button" @click="addToDonationList(product)">{{ t('add_donation_list') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste de dons -->
    <div class="five wide column">
      <div class="ui grid">
        <div class="eleven wide column">
          <h3 class="ui header">{{ t('donation_list') }}</h3>
        </div>
        <div class="five wide column right aligned">
          <button class="ui teal button" @click="validateDonation">{{ t('validate_donation') }}</button>
        </div>
      </div>

      <div v-for="item in donationList" :key="item.Product_ID" :class="['ui segment', { 'other-product': item.isOther }]">
        <div class="ui grid">
          <div class="seven wide column">
            <div v-if="item.isOther">
              <input type="text" v-model="item.Name" :placeholder="t('other_product_name')" style="margin-bottom: 5px;" />
              <select v-model="item.Category_Name" class="ui dropdown" style="width: 100%;">
                <option value="">{{ t('selectCategory') }}</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div v-else>
              <strong>{{ item.Name }}</strong>
              <p>{{ t('category') }}: {{ item.Category_Name }}</p>
            </div>
          </div>
          <div class="nine wide column right aligned">
            <div class="ui input quantity-controls">
              <i class="minus icon" @click="item.quantity > 1 ? item.quantity-- : removeFromDonationList(item)"></i>
              <input type="number" v-model="item.quantity" @input="updateQuantity(item)" style="width: 70px; text-align: center;">
              <i class="plus icon" @click="item.quantity++"></i>
              <i class="trash icon" @click="removeFromDonationList(item)"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton pour ajouter un produit "autre" -->
      <button class="ui yellow button" @click="addOtherProduct">{{ t('add_other_product') }}</button>
    </div>
  </div>
</template>

<style scoped>
.spacer_perso {
  margin-top: 4.5%;
}

.ui.grid {
  padding: 20px;
}

.product-card {
  width: calc(40% - 10px);
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

.other-product {
  border-color: orange !important; /* Bordure orange pour différencier les produits "autre" */
}

.ui.grid > .five.wide.column {
  padding-right: 0;
}
</style>
