<template>
  <div class="ui form">
    <!-- Titre -->
    <div class="field">
      <label>Titre</label>
      <input v-model="title" placeholder="Titre" type="text" />
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
            <input type="hidden" v-model="propose" />
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
        <input type="hidden" v-model="category" />
        <i class="dropdown icon"></i>
        <div class="text">Choisir</div>
        <div class="menu">
          <div v-for="cat in categories" :key="cat.id" class="item" :data-value="cat.id">{{ cat.name }}</div>
        </div>
      </div>
    </div>

    <!-- Date de début -->
    <div class="field">
      <label>Date de début</label>
      <div class="ui calendar" id="rangestart">
        <div class="ui input left icon">
          <i class="calendar icon"></i>
          <input v-model="startDate" type="text" placeholder="Start" />
        </div>
      </div>
    </div>

    <!-- Durée du service -->
    <div class="field">
      <label>Durée du service</label>
      <input v-model="duration" type="text" maxlength="3" placeholder="Nombre d'heures" />
    </div>

    <!-- Format -->
    <div class="field">
      <label>Format</label>
      <div class="ui compact selection dropdown" ref="formatDropdown">
        <input type="hidden" v-model="format" />
        <i class="dropdown icon"></i>
        <div class="text">Choisir</div>
        <div class="menu">
          <div class="item" data-value="Jours">Jours</div>
          <div class="item" data-value="Heures">Heures</div>
          <div class="item" data-value="Minutes">Minutes</div>
        </div>
      </div>
    </div>

    <!-- Nombre de personnes -->
    <div v-if="propose === 'Proposer'" class="field">
      <label>Combien de personnes peuvent participer</label>
      <input v-model="places" type="text" maxlength="3" placeholder="Nombre de places" />
    </div>

    <!-- Outils -->
    <div v-if="propose === 'Proposer'" class="field">
      <label>Outils</label>
      <div class="ui compact selection dropdown" ref="toolsDropdown">
        <input type="hidden" v-model="tools" />
        <i class="dropdown icon"></i>
        <div class="text">Aucun</div>
        <div class="menu">
          <div v-for="tool in toolsOptions" :key="tool.id" class="item" :data-value="tool.id">{{ tool.name }}</div>
          <div class="item" data-value="Autre">Autre</div>
        </div>
      </div>

      <!-- Préciser l'outil si Autre est sélectionné -->
      <div v-if="tools === 'Autre'" class="field">
        <label>Préciser</label>
        <input v-model="toolsOther" type="text" placeholder="Préciser" />
      </div>
    </div>

    <!-- Besoin d'outils supplémentaires -->
    <div class="inline field">
      <div class="ui toggle checkbox">
        <input type="checkbox" v-model="needsExtraTools" tabindex="0" class="hidden" />
        <label>Faut-il des outils supplémentaires</label>
      </div>
    </div>

    <!-- Outils supplémentaires -->
    <div v-if="needsExtraTools">
      <div v-for="(tool, index) in extraToolsOptions.slice(0, 5)" :key="index" class="ui compact selection dropdown" ref="extraToolsDropdown">
        <input type="hidden" :name="'OutilClient_' + index" />
        <i class="dropdown icon"></i>
        <div class="text">Aucun</div>
        <div class="menu">
          <div class="item" data-value="Aucun">Aucun</div>
          <div v-for="tool in extraToolsOptions" :key="tool.id" class="item" :data-value="tool.id">{{ tool.name }}</div>
          <div class="item" data-value="Autre">Autre</div>
        </div>
        <!-- Préciser l'outil si Autre est sélectionné -->
        <div v-if="extraTools[index] === 'Autre'" class="field">
          <label>Préciser</label>
          <input v-model="extraTools[index]" type="text" placeholder="Préciser" />
        </div>
      </div>
    </div>

    <!-- Besoin d'adresse -->
    <div class="ui segment">
      <div class="field">
        <div class="ui toggle checkbox">
          <input type="checkbox" v-model="needsAddress" tabindex="0" class="hidden" />
          <label>Quel est l'adresse du service?</label>
        </div>
      </div>
    </div>

    <!-- Besoin d'adresse du client -->
    <div v-if="propose === 'Proposer'" class="ui segment">
      <div class="field">
        <div class="ui toggle checkbox">
          <input type="checkbox" v-model="needsCustomerAddress" tabindex="0" class="hidden" />
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
      <input type="file" @change="handleFileUpload" multiple />
    </div>

    <!-- Boutons -->
    <div class="ui buttons">
      <button class="negative ui button">Annuler</button>
      <button class="ui button">Prévisualiser</button>
      <button class="positive ui button">Sauvegarder</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';

const title = ref('');
const propose = ref('');
const category = ref('');
const startDate = ref('');
const duration = ref('');
const format = ref('');
const places = ref('');
const tools = ref('Aucun');
const toolsOther = ref('');
const needsExtraTools = ref(false);
const extraTools = ref([]);
const needsAddress = ref(false);
const needsCustomerAddress = ref(false);
const description = ref('');
const image = ref(null);

const categories = ref([]);
const toolsOptions = ref([]);
const extraToolsOptions = ref([]);

async function fetchCategories() {
  try {
    const response = await axios.get('/api/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
  }
}

async function fetchTools() {
  try {
    const response = await axios.get('/api/tools');
    toolsOptions.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des outils:', error);
  }
}

async function fetchExtraTools() {
  try {
    const response = await axios.get('/api/extra-tools');
    extraToolsOptions.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des outils supplémentaires:', error);
  }
}

onMounted(async () => {
  await fetchCategories();
  await fetchTools();
  await fetchExtraTools();
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
    console.log('Fichier sélectionné:', file);
  }
}
</script>

<style scoped>
/* Ajoutez ici les styles spécifiques à votre composant */
</style>
