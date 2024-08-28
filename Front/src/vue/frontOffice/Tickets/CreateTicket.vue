<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderFrontOffice.vue";
import { useI18n } from 'vue-i18n';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';

const { t } = useI18n();
const title = ref('');
const direction = ref(null);
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

// Fetch categories on mount
const fetchCategories = async () => {
  try {
    const response = await axios.get('/skills');
    categories.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
  }
};

onMounted(fetchCategories);

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
    console.log('Fichier sélectionné:', file);
  }
}

// Save ticket using FormData
const saveTicket = async () => {
  const formData = new FormData();

  // Append form fields to FormData
  formData.append('title', title.value);
  formData.append('direction', direction.value);
  formData.append('skillId', category.value);
  formData.append('startDate', startDate.value);
  formData.append('startTime', startTime.value);

  // Calculate duration in minutes
  let calculatedDuration = parseInt(duration.value, 10);
  if (format.value === 'Heures') {
    calculatedDuration *= 60;
  } else if (format.value === 'Jours') {
    calculatedDuration *= 1440;
  }
  formData.append('duration', calculatedDuration);

  formData.append('places', places.value);
  formData.append('address', address.value);
  formData.append('needsCustomerAddress', needsCustomerAddress.value);
  formData.append('description', description.value);

  // Append image to FormData, if available
  if (image.value) {
    formData.append('image', image.value);
  }

  // Get the user ID from the token and append to FormData
  const token = Cookies.get('token');
  if (token) {
    const decodedToken = VueJwtDecode.decode(token);
    const userId = decodedToken.uid;
    formData.append('ownerUserId', userId);
  } else {
    console.error('Token non trouvé');
    return; // Stop the function if the token is not available
  }

  // Debugging: Log the FormData content
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  // Send the request using axios
  try {
    const response = await axios.post('/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the correct content type
      },
    });
    console.log('Ticket sauvegardé:', response.data);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du ticket:', error.response.data || error.message);
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
        <input v-model="title" placeholder="Titre" type="text" required/>
        <div v-if="!title" class="ui pointing red basic label">Le titre est requis</div>
      </div>

      <!-- Direction -->
      <div class="field">
        <div class="ui grid">
          <div class="one wide column">
            <label>Je souhaite</label>
          </div>
          <div class="two wide column">
            <select v-model="direction" class="ui dropdown" required>
              <option value="" disabled>Choisir</option>
              <option :value="true">Proposer</option>
              <option :value="false">Demander</option>
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
        <select v-model="category" class="ui dropdown" required>
          <option value="" disabled>Choisir</option>
          <option v-for="categorie in categories" :key="categorie.Skill_ID" :value="categorie.Skill_ID">
            {{ categorie.Name }}
          </option>
        </select>
      </div>

      <!-- Date et Heure de début -->
      <div class="two fields">
        <div class="field">
          <label>Date de début</label>
          <div class="ui calendar" id="startdate">
            <div class="ui input left icon">
              <i class="calendar icon"></i>
              <input v-model="startDate" type="date" placeholder="Date de début" required/>
            </div>
          </div>
        </div>

        <div class="field">
          <label>Heure de début</label>
          <div class="ui calendar" id="starttime">
            <div class="ui input left icon">
              <i class="clock icon"></i>
              <input v-model="startTime" type="time" placeholder="Heure de début" required/>
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
            <input v-model="duration" type="text" maxlength="3" placeholder="Durée" required/>
          </div>
          <div class="four wide column">
            <select v-model="format" class="ui dropdown" required>
              <option value="" disabled>Format</option>
              <option value="Minutes">Minutes</option>
              <option value="Heures">Heures</option>
              <option value="Jours">Jours</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Nombre de personnes -->
      <div v-if="direction === true" class="field">
        <label>Combien de personnes peuvent participer</label>
        <input v-model="places" type="text" maxlength="3" placeholder="Nombre de places"/>
      </div>

      <!-- Adresse du service -->
      <div class="field">
        <label>Adresse du service</label>
        <input v-model="address" type="text" placeholder="Adresse"/>
      </div>

      <!-- Besoin d'adresse du client -->
      <div v-if="direction === true" class="ui segment">
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
        <textarea v-model="description" required></textarea>
      </div>

      <!-- Upload image -->
      <div class="field">
        <label>Image</label>
        <input type="file" @change="handleFileUpload"/>
      </div>

      <!-- Boutons -->
      <div class="ui buttons">
        <button class="negative ui button">Annuler</button>
        <button class="ui button">Prévisualiser</button>
        <button type="button" class="positive ui button" @click="saveTicket">Sauvegarder</button>
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
