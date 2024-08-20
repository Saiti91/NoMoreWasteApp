<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const users = ref([]);
const router = useRouter();

// Variables pour les filtres
const selectedRole = ref('all');
const selectedSubscription = ref('all');
const searchName = ref('');

// Variables pour la pagination
const currentPage = ref(1);
const usersPerPage = 10; // Nombre d'utilisateurs par page

// Fonction pour normaliser une chaîne (supprimer les accents)
const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// Fonction pour récupérer les utilisateurs
const fetchUsers = async () => {
  try {
    const response = await axios.get('/users');
    users.value = response.data;
    console.log(users.value);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Propriété calculée pour filtrer et trier les utilisateurs
const filteredUsers = computed(() => {
  return users.value
      .filter(user => {
        return (selectedRole.value === 'all' || user.Role === selectedRole.value) &&
            (selectedSubscription.value === 'all' || (selectedSubscription.value === 'subscribed' && user.Current_Subscription) || (selectedSubscription.value === 'not_subscribed' && !user.Current_Subscription)) &&
            (searchName.value === '' || normalizeString(user.Name).includes(normalizeString(searchName.value)) || normalizeString(user.Firstname).includes(normalizeString(searchName.value)));
      })
      .sort((a, b) => b.User_ID - a.User_ID); // Tri par ID décroissant
});

// Propriété calculée pour la pagination
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage;
  const end = start + usersPerPage;
  return filteredUsers.value.slice(start, end);
});

// Calcul du nombre total de pages
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage);
});

// Fonction pour naviguer vers les détails d'un utilisateur
const goToDetails = (userId) => {
  router.push({name: 'UserDetails', params: {id: userId}});
};

// Fonction pour formater la date
const formatDate = (date) => {
  if (!date) return 'Non renseigné';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

// Fonctions pour naviguer entre les pages
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

// Watchers pour réinitialiser currentPage lorsque les filtres changent
watch([searchName, selectedRole, selectedSubscription], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Admin Users</h1>

    <!-- Filters -->
    <div class="ui form">
      <div class="fields">
        <div class="field">
          <label>Role</label>
          <select v-model="selectedRole" class="ui dropdown">
            <option value="all">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="volunteer">{{ t('volunteer') }}</option>
            <!-- Ajoutez d'autres rôles si nécessaire -->
          </select>
        </div>
        <div class="field">
          <label>Abonnement</label>
          <select v-model="selectedSubscription" class="ui dropdown">
            <option value="all">Tous</option>
            <option value="subscribed">Abonné</option>
            <option value="not_subscribed">Non Abonné</option>
          </select>
        </div>
        <div class="field">
          <label>Nom ou Prénom</label>
          <input type="text" v-model="searchName" placeholder="Rechercher par nom ou prénom">
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Firstname</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Birthdate</th>
        <th>Subscription</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in paginatedUsers" :key="user.User_ID" class="clickable-row" @click="goToDetails(user.User_ID)">
        <td>{{ user.User_ID }}</td>
        <td>{{ user.Name || 'Non renseigné' }}</td>
        <td>{{ user.Firstname || 'Non renseigné' }}</td>
        <td>{{ user.Email }}</td>
        <td>{{ user.Phone || 'Non renseigné' }}</td>
        <td>{{ user.Role }}</td>
        <td>{{ formatDate(user.Birthdate) }}</td>
        <td>
          <span v-if="user.Current_Subscription">Abonné</span>
          <span v-else>Non Abonné</span>
        </td>
        <td>
          <button @click.stop="goToDetails(user.User_ID)">Détails</button>
        </td>
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

.ui.celled.table.full-width-table {
  width: 100%;
}

.ui.celled.table tr.clickable-row {
  cursor: pointer;
}

.ui.celled.table tr.clickable-row:hover {
  background-color: #f1f1f1;
}

.ui.celled.table tr td button {
  margin-right: 5px;
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
