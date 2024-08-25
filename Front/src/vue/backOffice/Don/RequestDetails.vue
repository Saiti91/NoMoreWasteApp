<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';  // Import SweetAlert2 for better confirmation dialogs

const { t } = useI18n();
const requests = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const categories = ref([]);
const selectedCategory = ref('all');
const selectedDateRange = ref([null, null]);
const searchQuery = ref('');
const selectedProcessedStatus = ref('all');
const router = useRouter();

const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const fetchRequests = async () => {
  try {
    const response = await axios.get('/requests');
    requests.value = response.data;

    categories.value = [...new Set(requests.value.map(request => request.Product.Category || 'Inconnu'))];

    console.log(requests.value);
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
};

const deleteRequest = async (requestId) => {
  try {
    const confirmed = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action supprimera la demande sélectionnée!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (confirmed.isConfirmed) {
      await axios.delete(`/requests/${requestId}`);
      Swal.fire('Supprimée!', 'La demande a été supprimée.', 'success');
      fetchRequests();  // Refresh the request list
    }
  } catch (error) {
    Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
  }
};

const filteredRequests = computed(() => {
  let filtered = requests.value;

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter(request => request.Product.Category === selectedCategory.value);
  }
  if (selectedProcessedStatus.value !== 'all') {
    filtered = filtered.filter(request => {
      return selectedProcessedStatus.value === 'processed'
          ? request.Processed === 1
          : request.Processed === 0;
    });
  }
  if (selectedDateRange.value && selectedDateRange.value[0] && selectedDateRange.value[1]) {
    const [startDate, endDate] = selectedDateRange.value;
    filtered = filtered.filter(request => {
      const requestDate = new Date(request.Request_Date);
      return requestDate >= new Date(startDate) && requestDate <= new Date(endDate);
    });
  }
  if (searchQuery.value) {
    const normalizedSearchQuery = normalizeString(searchQuery.value);
    filtered = filtered.filter(request =>
        normalizeString(request.Product.Name).includes(normalizedSearchQuery)
    );
  }

  return filtered;
});

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRequests.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRequests.value.length / itemsPerPage);
});

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

const goToUserDetails = (user_id) => {
  router.push({ name: 'UserDetails', params: { id: user_id } });
};

const goToCreateTour = () => {
  router.push({ name: 'RequestsCreateTour' });
};

const resetDateRange = () => {
  selectedDateRange.value = [null, null];
};

const isDateSelected = computed(() => {
  return selectedDateRange.value[0] !== null || selectedDateRange.value[1] !== null;
});

watch([searchQuery, selectedCategory, selectedProcessedStatus, selectedDateRange], () => {
  currentPage.value = 1;
});

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

onMounted(() => {
  fetchRequests();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="header-section">
      <h1>Requests Admin</h1>
      <button class="ui teal button" @click="goToCreateTour">Créer une tournée</button>
    </div>

    <!-- Filters -->
    <div class="ui form">
      <div class="fields">
        <div class="field">
          <label>{{ t('category') }}</label>
          <select v-model="selectedCategory" class="ui dropdown">
            <option value="all">{{ t('allCategories') }}</option>
            <option v-for="type in categories" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('processedstatus') }}</label>
          <select v-model="selectedProcessedStatus" class="ui dropdown">
            <option value="all">{{ t('allrequests') }}</option>
            <option value="processed">{{ t('processedrequests') }}</option>
            <option value="unprocessed">{{ t('unprocessedrequests') }}</option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('search') }}</label>
          <input type="text" v-model="searchQuery" placeholder="Rechercher un produit...">
        </div>
        <div class="field date-range-field">
          <label>{{ t('dateRange') }}</label>
          <div class="date-range-inputs">
            <input type="date" v-model="selectedDateRange[0]">
            <input type="date" v-model="selectedDateRange[1]">
            <button class="ui button" v-if="isDateSelected" @click="resetDateRange">Réinitialiser la période</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>Nom du produit</th>
        <th>Quantité</th>
        <th>Date de la demande</th>
        <th>Catégorie</th>
        <th>Email du demandeur</th>
        <th>Statut</th>
        <th>Date de traitement</th>
        <th>Actions</th> <!-- New Actions column -->
      </tr>
      </thead>
      <tbody>
      <tr v-if="paginatedRequests.length === 0">
        <td colspan="8" class="center aligned">Aucune demande disponible pour les filtres appliqués.</td>
      </tr>
      <tr v-else v-for="request in paginatedRequests" :key="request.Request_ID" class="clickable-row">
        <td>{{ request.Product.Name }}</td>
        <td>{{ request.Quantity }}</td>
        <td>{{ formatDate(request.Request_Date) }}</td>
        <td>{{ request.Product.Category || 'Inconnu' }}</td>
        <td @click="goToUserDetails(request.User.User_ID)">{{ request.User.Email }}</td>
        <td>{{ request.Processed === 1 ? 'Traitée' : 'Non traitée' }}</td>
        <td>{{ request.Processed === 1 && request.Processed_Date ? formatDate(request.Processed_Date) : 'N/A' }}</td>
        <td v-if="request.Processed === 0">
          <button class="ui red button" @click.stop="deleteRequest(request.Request_ID)">Supprimer</button>
        </td>
        <td v-else>-</td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination Buttons -->
    <div class="pagination-controls">
      <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ui.form .fields .date-range-field {
  display: flex;
  flex-direction: column;
}

.date-range-inputs {
  display: flex;
  align-items: center;
}

.date-range-inputs input[type="date"] {
  margin-right: 10px;
  flex: 1;
}

.date-range-inputs button {
  margin-left: 10px;
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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  margin: 0 10px;
}
</style>
