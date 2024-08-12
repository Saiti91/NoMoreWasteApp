<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import Header from "@/components/HeaderFrontOffice.vue";
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2'; // Import de SweetAlert2

const { t } = useI18n();
const selectedCategory = ref('all');
const searchQuery = ref('');
const products = ref([]);
const donationList = ref([]);
const categories = ref([]); // Catégories extraites des produits

// Récupération des produits disponibles pour le don
const fetchProducts = async () => {
  try {
    const response = await axios.get('/stocks'); // Remplacez par l'URL appropriée
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
const validateDonation = () => {
  // Vérifier si un produit "autre" n'a pas de nom
  const invalidOtherProduct = donationList.value.find(item => item.isOther && !item.Name.trim());

  if (invalidOtherProduct) {
    // Afficher une pop-up d'erreur
    Swal.fire({
      icon: 'error',
      title: t('error_title'),
      text: t('error_other_product_name'),
    });
  } else {
    try {
      console.log('Liste des dons validée:', donationList.value);
      // Vous pouvez aussi envoyer la liste des dons validée à votre serveur ici
    } catch (error) {
      console.error('Erreur lors de la validation de la liste des dons :', error);
    }
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
              <input type="text" v-model="item.Name" :placeholder="t('other_product_name')" />
            </div>
            <div v-else>
              <strong>{{ item.Name }}</strong>
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

.other-product {
  border-color: orange !important; /* Bordure orange pour différencier les produits "autre" */
}

.ui.grid > .five.wide.column {
  padding-right: 0;
}
</style>
