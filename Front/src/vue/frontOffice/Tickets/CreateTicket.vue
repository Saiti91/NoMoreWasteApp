<script setup>
import { ref, onMounted, computed } from 'vue';
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
const selectedAddressId = ref(''); // Cette variable contiendra l'ID de l'adresse sélectionnée
const needsCustomerAddress = ref(false);
const description = ref('');
const image = ref(null);
const categories = ref([]);
const addresses = ref({}); // Initialiser comme un objet vide

// Récupérer les catégories lors du montage du composant
const fetchCategories = async () => {
  try {
    const response = await axios.get('/skills');
    categories.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
  }
};

// Récupérer les adresses de l'utilisateur
const fetchUserAddresses = async (userId) => {
  try {
    const response = await axios.get(`/addresses/${userId}`);
    // Assurez-vous que la réponse est un objet
    if (response.data && typeof response.data === 'object') {
      addresses.value = response.data;
    } else {
      console.error('La réponse de l\'API des adresses n\'est pas un objet:', response.data);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des adresses:', error);
  }
};

// Fusionner l'adresse pour l'affichage
const formattedAddresses = computed(() => {
  if (addresses.value && typeof addresses.value === 'object') {
    const address = addresses.value;
    const result = {
      id: address.Address_ID,
      fullAddress: `${address.Street}, ${address.City}, ${address.State}, ${address.Postal_Code}, ${address.Country}`
    };

    // Afficher l'adresse fusionnée dans la console
    console.log('Adresse fusionnée:', result);

    return [result]; // Retourner un tableau contenant l'adresse
  } else {
    console.error('addresses.value n\'est pas un objet ou est vide:', addresses.value);
    return [];
  }
});

// Se déclenche lors du montage du composant
onMounted(async () => {
  fetchCategories();

  // Récupérer le token et décoder l'ID utilisateur
  const token = Cookies.get('token');
  if (token) {
    const decodedToken = VueJwtDecode.decode(token);
    const userId = decodedToken.uid;

    // Récupérer les adresses de l'utilisateur
    await fetchUserAddresses(userId);
  } else {
    console.error('Token non trouvé');
  }
});

// Gérer le téléchargement de fichier
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
    console.log('Fichier sélectionné:', file);
  }
}

// Enregistrer le ticket en utilisant FormData
const saveTicket = async () => {
  const formData = new FormData();

  // Ajouter les champs du formulaire au FormData
  formData.append('title', title.value);
  formData.append('direction', direction.value);
  formData.append('skillId', category.value);
  formData.append('startDate', startDate.value);
  formData.append('startTime', startTime.value);

  // Calculer la durée en minutes
  let calculatedDuration = parseInt(duration.value, 10);
  if (format.value === 'Heures') {
    calculatedDuration *= 60;
  } else if (format.value === 'Jours') {
    calculatedDuration *= 1440;
  }
  formData.append('duration', calculatedDuration);

  formData.append('places', places.value);
  formData.append('addressId', selectedAddressId.value); // Utiliser l'ID de l'adresse sélectionnée
  formData.append('needsCustomerAddress', needsCustomerAddress.value);
  formData.append('description', description.value);

  // Ajouter l'image au FormData, si disponible
  if (image.value) {
    formData.append('image', image.value);
  }

  // Ajouter l'ID de l'utilisateur au FormData
  const token = Cookies.get('token');
  if (token) {
    const decodedToken = VueJwtDecode.decode(token);
    const userId = decodedToken.uid;
    formData.append('ownerUserId', userId);
  } else {
    console.error('Token non trouvé');
    return; // Arrêter la fonction si le token n'est pas disponible
  }

  // Débogage : afficher le contenu du FormData
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  // Envoyer la requête avec axios
  try {
    const response = await axios.post('/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Spécifier le bon type de contenu
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
              <option :value="1">Proposer</option>
              <option :value="0">Demander</option>
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
      <div v-if="direction === 1" class="field">
        <label>Combien de personnes peuvent participer</label>
        <input v-model="places" type="text" maxlength="3" placeholder="Nombre de places"/>
      </div>

      <!-- Sélection de l'adresse -->
      <div class="field">
        <label>Adresse du service</label>
        <select v-model="selectedAddressId" class="ui dropdown" required>
          <option value="" disabled>Choisir</option>
          <option v-for="address in formattedAddresses" :key="address.id" :value="address.id">
            {{ address.fullAddress }}
          </option>
        </select>
      </div>

      <!-- Besoin d'adresse client -->
      <div class="field">
        <div class="ui checkbox">
          <input type="checkbox" v-model="needsCustomerAddress"/>
          <label>Besoin d'adresse client</label>
        </div>
      </div>

      <!-- Description -->
      <div class="field">
        <label>Description</label>
        <textarea v-model="description" rows="4" placeholder="Description" required></textarea>
      </div>

      <!-- Image -->
      <div class="field">
        <label>Image</label>
        <input type="file" @change="handleFileUpload"/>
      </div>

      <!-- Bouton d'enregistrement -->
      <button class="ui button primary" @click="saveTicket">Enregistrer</button>
    </div>
  </div>
</template>

<style scoped>
/* Ajouter des styles spécifiques ici */
</style>
