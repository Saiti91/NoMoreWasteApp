<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderFrontOffice.vue";
import { useI18n } from 'vue-i18n';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import router from "@/routers/Router.js";
import Swal from 'sweetalert2';

const t = useI18n();
const title = ref('');
const direction = ref(null);
const category = ref('');
const startDate = ref('');
const startTime = ref('');
const endDate = ref('');
const endTime = ref('');
const duration = ref('');
const format = ref('');
const places = ref('');
const selectedAddressId = ref('');
const needsCustomerAddress = ref(false);
const description = ref('');
const tools = ref('');
const image = ref(null);
const categories = ref([]);
const addresses = ref({});
const userId = ref(null);
const userSkills = ref([]);
const changeEndDate = ref(false);

// Récupérer les catégories lors du montage du composant
const fetchCategories = async () => {
  try {
    const response = await axios.get('/skills');
    categories.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
  }
};

// Récupérer les compétences de l'utilisateur
const fetchUserSkills = async (userId) => {
  try {
    const response = await axios.get(`/skills/user/${userId}`);
    userSkills.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences de l\'utilisateur:', error);
  }
};

// Récupérer les adresses de l'utilisateur
const fetchUserAddresses = async (userId) => {
  try {
    const response = await axios.get(`/addresses/${userId}`);
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
    return [result];
  } else {
    console.error('addresses.value n\'est pas un objet ou est vide:', addresses.value);
    return [];
  }
});

// Mettre à jour la date de fin d'inscription automatiquement
watch([startDate, startTime, endDate, endTime], ([newStartDate, newStartTime, newEndDate, newEndTime]) => {
  if (changeEndDate.value) {
    if (newStartDate && newStartTime) {
      endDate.value = newEndDate || newStartDate;
      endTime.value = newEndTime || newStartTime;
    }
  }
});

// Se déclenche lors du montage du composant
onMounted(async () => {
  await fetchCategories();
  const token = Cookies.get('token');
  if (token) {
    const decodedToken = VueJwtDecode.decode(token);
    userId.value = decodedToken.uid;
    await fetchUserAddresses(userId.value);
    await fetchUserSkills(userId.value);
  } else {
    router.push({ name: 'Login' });
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

  // Logs pour le débogage
  console.log('Titre:', title.value);
  formData.append('title', title.value);

  console.log('Direction:', direction.value);
  formData.append('direction', direction.value);

  console.log('Catégorie:', category.value);
  formData.append('skillId', category.value);

  console.log('Date de début:', startDate.value);
  formData.append('startDate', startDate.value);

  console.log('Heure de début:', startTime.value);
  formData.append('startTime', startTime.value);

  let calculatedDuration = parseInt(duration.value, 10);
  if (format.value === 'Heures') {
    calculatedDuration *= 60;
  } else if (format.value === 'Jours') {
    calculatedDuration *= 1440;
  }
  console.log('Durée:', calculatedDuration);
  formData.append('duration', calculatedDuration);

  console.log('Nombre de places:', places.value || 1);
  formData.append('places', places.value || 1);

  console.log('Adresse ID:', selectedAddressId.value);
  formData.append('addressId', selectedAddressId.value);

  console.log('Besoin d\'adresse client:', needsCustomerAddress.value);
  formData.append('needsCustomerAddress', needsCustomerAddress.value);

  console.log('Description:', description.value);
  formData.append('description', description.value);

  // Ajouter les outils nécessaires
  console.log('Outils nécessaires:', tools.value);
  formData.append('Tools', tools.value);

  if (image.value) {
    console.log('Image:', image.value);
    formData.append('image', image.value);
  }

  if (userId.value) {
    console.log('ID utilisateur propriétaire:', userId.value);
    formData.append('ownerUserId', userId.value);
  }

  // Ajouter la date de fin d'inscription
  let endOfSubscription = `${startDate.value}T${startTime.value}`;
  if (changeEndDate.value) {
    if (endDate.value && endTime.value) {
      endOfSubscription = `${endDate.value}T${endTime.value}`;
    }
  }
  console.log('Date de fin d\'inscription:', endOfSubscription);
  formData.append('End_Of_Subscription', endOfSubscription);

  try {
    const response = await axios.post('/tickets/tickets', formData);
    console.log('Ticket sauvegardé:', response.data);
    Swal.fire({
      title: 'Succès',
      text: 'Le ticket a été enregistré avec succès!',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      router.push('/');
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du ticket:', error.response?.data || error.message);
    Swal.fire({
      title: 'Erreur',
      text: 'Une erreur s\'est produite lors de l\'enregistrement du ticket.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

// Mettre à jour les options des catégories en fonction de la direction sélectionnée
const filteredCategories = computed(() => {
  if (direction.value === 1) { // Si direction est "Proposer"
    return userSkills.value; // Afficher les compétences de l'utilisateur
  }
  return categories.value; // Afficher toutes les catégories
});
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
          <div class="two wide column custom-right-padding">
            <label>Je souhaite</label>
          </div>
          <div class="three wide column custom-left-padding">
            <select v-model="direction" class="ui dropdown" required>
              <option value="">Choisir</option>
              <option :value="1">Proposer</option>
              <option :value="0">Demander</option>
            </select>
          </div>
          <div class="two wide column">
            <label class="custom-margin">un service</label>
          </div>
        </div>
      </div>

      <!-- Catégorie -->
      <div class="field">
        <label>Catégorie</label>
        <select v-model="category" class="ui dropdown" required>
          <option value="" disabled>Choisir</option>
          <option v-for="categorie in filteredCategories" :key="categorie.Skill_ID" :value="categorie.Skill_ID">
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

      <!-- Changer la date de fin d'inscription -->
      <div class="field">
        <div class="ui checkbox">
          <input type="checkbox" v-model="changeEndDate"/>
          <label>Changer la date de fin d'inscription</label>
        </div>
      </div>

      <!-- Date et Heure de fin -->
      <div v-if="changeEndDate" class="two fields">
        <div class="field">
          <label>Date de fin</label>
          <div class="ui calendar" id="enddate">
            <div class="ui input left icon">
              <i class="calendar icon"></i>
              <input v-model="endDate" type="date" placeholder="Date de fin"/>
            </div>
          </div>
        </div>

        <div class="field">
          <label>Heure de fin</label>
          <div class="ui calendar" id="endtime">
            <div class="ui input left icon">
              <i class="clock icon"></i>
              <input v-model="endTime" type="time" placeholder="Heure de fin"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Durée et Format -->
      <div class="field">
        <div class="ui grid">
          <div class="two wide column">
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

      <!-- Nombre de places -->
      <div v-if="direction === 1" class="field">
        <label>Nombre de places</label>
        <input v-model="places" type="number" min="1" placeholder="Nombre de places" required/>
      </div>

      <!-- Adresse -->
      <div class="field">
        <label>Adresse</label>
        <select v-model="selectedAddressId" class="ui dropdown" required>
          <option v-for="address in formattedAddresses" :key="address.id" :value="address.id">
            {{ address.fullAddress }}
          </option>
        </select>
      </div>

      <!-- Adresse client -->
      <div v-if="direction === 1" class="field">
        <label><input v-model="needsCustomerAddress" type="checkbox"/> J'ai besoin de l'adresse du client</label>
      </div>

      <!-- Description -->
      <div class="field">
        <label>Description</label>
        <textarea v-model="description" placeholder="Description du service"></textarea>
      </div>

      <!-- Outils nécessaires -->
      <div v-if="direction === 1" class="field">
        <label>Outils nécessaires</label>
        <textarea v-model="tools" maxlength="255" placeholder="Entrez les outils nécessaires"></textarea>
      </div>

      <!-- Image -->
      <div class="field">
        <label>Image</label>
        <input type="file" @change="handleFileUpload"/>
      </div>

      <!-- Bouton de soumission -->
      <button class="ui button" @click="saveTicket">Enregistrer</button>
    </div>
  </div>
</template>

<style scoped>
.custom-left-padding {
  padding-left: 0 !important;
}

.custom-right-padding {
  padding-right: 0 !important;
}
</style>
