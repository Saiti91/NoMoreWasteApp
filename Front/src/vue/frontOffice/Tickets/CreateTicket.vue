<script setup>
import { nextTick, onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderFrontOffice.vue";
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
});

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

  // Console log pour chaque donnée
  console.log('Titre:', title.value);
  console.log('Je souhaite:', propose.value);
  console.log('Catégorie:', category.value);
  console.log('Date de début:', startDate.value);
  console.log('Heure de début:', startTime.value);
  console.log('Durée:', duration.value);
  console.log('Format:', format.value);
  console.log('Nombre de places:', places.value);
  console.log('Adresse du service:', address.value);
  console.log('Besoin d\'adresse du client:', needsCustomerAddress.value);
  console.log('Description:', description.value);
  if (image.value) {
    console.log('Image:', image.value.name); // Affiche le nom du fichier
  } else {
    console.log('Aucune image sélectionnée');
  }

  try {
    const response = await axios.post('/tickets', formData);
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
            <select v-model="propose" class="ui dropdown">
              <option value="" disabled>Choisir</option>
              <option value="Proposer">Proposer</option>
              <option value="Demander">Demander</option>
            </select>
          </div>
          <div class="two wide column">
            <label>un service</label>
          </div>
        </div>
      </div>

      <!-- Catégorie -->
      <div class="field">
        <label>Catégorie</label>
        <select v-model="category" class="ui dropdown">
          <option value="" disabled>Choisir</option>
          <option v-for="cat in categories" :key="cat.Skill_ID" :value="cat.Skill_ID">
            {{ cat.Name }}
          </option>
        </select>
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
            <select v-model="format" class="ui dropdown">
              <option value="" disabled>Format</option>
              <option value="Minutes">Minutes</option>
              <option value="Heures">Heures</option>
              <option value="Jours">Jours</option>
            </select>
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
