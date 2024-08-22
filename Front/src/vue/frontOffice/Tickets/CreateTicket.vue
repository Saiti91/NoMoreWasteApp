<script setup>
import { nextTick, onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const title = ref('');
const propose = ref('');
const category = ref('');
const startDate = ref('');
const startTime = ref('');
const duration = ref('');
const format = ref('');
const places = ref('');
const address = ref('');
const needsCustomerAddress = ref(false);
const description = ref('');
const image = ref(null);

const categories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await axios.get('/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
  }
};

onMounted(async () => {
  await fetchCategories();
  await nextTick(() => {
    initializeDropdowns();
  });
});

function initializeDropdowns() {
  $('.ui.dropdown').dropdown();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
    console.log('Fichier sélectionné:', file);
  }
}

// Fonction pour sauvegarder le ticket
const saveTicket = async () => {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('propose', propose.value);
  formData.append('category', category.value);
  formData.append('startDate', startDate.value);
  formData.append('startTime', startTime.value);
  formData.append('duration', duration.value);
  formData.append('format', format.value);
  formData.append('places', places.value);
  formData.append('address', address.value);
  formData.append('needsCustomerAddress', needsCustomerAddress.value);
  formData.append('description', description.value);
  if (image.value) {
    formData.append('image', image.value);
  }

  try {
    const response = await axios.post('/api/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Ticket sauvegardé:', response.data);
    // Optionally, redirect or reset form after successful save
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du ticket:', error);
  }
};
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Création de Service</h1>
    <div class="ui form">
      <!-- Titre -->
      <div class="field">
        <label>Titre</label>
        <input v-model="title" placeholder="Titre" type="text"/>
        <div v-if="!title" class="ui pointing red basic label">Le titre est requis</div>
      </div>

      <!-- Propose ou Demande -->
      <div class="field">
        <div class="ui grid">
          <div class="two wide column">
            <label>Je souhaite</label>
          </div>
          <div class="two wide column">
            <div class="ui compact selection dropdown" ref="proposeDropdown">
              <input type="hidden" v-model="propose"/>
              <i class="dropdown icon"></i>
              <div class="text">Choisir</div>
              <div class="menu">
                <div class="item" data-value="Proposer">Proposer</div>
                <div class="item" data-value="Demander">Demander</div>
              </div>
            </div>
          </div>
          <div class="two wide column">
            <label>un service</label>
          </div>
        </div>
      </div>

      <!-- Catégorie -->
      <div class="field">
        <label>Catégorie</label>
        <div class="ui compact selection dropdown" ref="categoryDropdown">
          <input type="hidden" v-model="category"/>
          <i class="dropdown icon"></i>
          <div class="text">Choisir</div>
          <div class="menu">
            <div v-for="cat in categories" :key="cat.Category_ID" class="item" :data-value="cat.Category_ID">
              {{ cat.Name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Date et Heure de début -->
      <div class="two fields">
        <!-- Date de début -->
        <div class="field">
          <label>Date de début</label>
          <div class="ui calendar" id="startdate">
            <div class="ui input left icon">
              <i class="calendar icon"></i>
              <input v-model="startDate" type="date" placeholder="Date de début"/>
            </div>
          </div>
        </div>

        <!-- Heure de début -->
        <div class="field">
          <label>Heure de début</label>
          <div class="ui calendar" id="starttime">
            <div class="ui input left icon">
              <i class="clock icon"></i>
              <input v-model="startTime" type="time" placeholder="Heure de début"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Durée et Format -->
      <div class="field">
        <div class="ui grid">
          <div class="three wide column">
            <label>Le service dure</label>
          </div>
          <div class="two wide column">
            <input v-model="duration" type="text" maxlength="3" placeholder="Durée"/>
          </div>
          <div class="four wide column">
            <div class="ui compact selection dropdown" ref="formatDropdown">
              <input type="hidden" v-model="format"/>
              <i class="dropdown icon"></i>
              <div class="text">Format</div>
              <div class="menu">
                <div class="item" data-value="Minutes">Minutes</div>
                <div class="item" data-value="Heures">Heures</div>
                <div class="item" data-value="Jours">Jours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nombre de personnes -->
      <div v-if="propose === 'Proposer'" class="field">
        <label>Combien de personnes peuvent participer</label>
        <input v-model="places" type="text" maxlength="3" placeholder="Nombre de places"/>
      </div>

      <!-- Adresse du service -->
      <div class="field">
        <label>Adresse du service</label>
        <input v-model="address" type="text" placeholder="Adresse"/>
      </div>

      <!-- Besoin d'adresse du client -->
      <div v-if="propose === 'Proposer'" class="ui segment">
        <div class="field">
          <div class="ui toggle checkbox">
            <input type="checkbox" v-model="needsCustomerAddress" tabindex="0" class="hidden"/>
            <label>Vous avez besoin de l'adresse des participants/membres</label>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="field">
        <label>Description</label>
        <textarea v-model="description"></textarea>
      </div>

      <!-- Upload image -->
      <div class="field">
        <label>Image</label>
        <input type="file" @change="handleFileUpload" multiple/>
      </div>

      <!-- Boutons -->
      <div class="ui buttons">
        <button class="negative ui button">Annuler</button>
        <button class="ui button">Prévisualiser</button>
        <button class="positive ui button" @click="saveTicket">Sauvegarder</button>
      </div>
    </div>
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
