<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Création de Service</h1>
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
              <input v-model="startDate" type="date" placeholder="Date de début" />
            </div>
          </div>
        </div>

        <!-- Heure de début -->
        <div class="field">
          <label>Heure de début</label>
          <div class="ui calendar" id="starttime">
            <div class="ui input left icon">
              <i class="clock icon"></i>
              <input v-model="startTime" type="time" placeholder="Heure de début" />
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
            <input v-model="duration" type="text" maxlength="3" placeholder="Durée" />
          </div>
          <div class="four wide column">
            <div class="ui compact selection dropdown" ref="formatDropdown">
              <input type="hidden" v-model="format" />
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

      <!-- Outils supplémentaires -->
      <div v-if="extraToolsOptions.length > 0">
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

      <!-- Adresse du service -->
      <div class="field">
        <label>Adresse du service</label>
        <input v-model="address" type="text" placeholder="Adresse" />
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
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
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
const tools = ref('Aucun');
const toolsOther = ref('');
const extraTools = ref([]);
const address = ref('');
const needsCustomerAddress = ref(false);
const description = ref('');
const image = ref(null);

const categories = ref([]);
const toolsOptions = ref([]);
const extraToolsOptions = ref([]);

const fetchCategories = async () => {
  try {
    const response = await axios.get('/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
  }
};

const fetchTools = async () => {
  try {
    const response = await axios.get('/api/tools');
    toolsOptions.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des outils:', error);
  }
};

const fetchExtraTools = async () => {
  try {
    const response = await axios.get('/api/extra-tools');
    extraToolsOptions.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des outils supplémentaires:', error);
  }
};

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
