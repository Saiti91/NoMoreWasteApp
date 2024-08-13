<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';

const users = ref([]);
const router = useRouter();

const fetchUsers = async () => {
  try {
    const response = await axios.get('/users');
    users.value = response.data;
    console.log(users.value);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const formatDate = (date) => {
  if (!date) return 'Non renseigné';
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(date).toLocaleDateString('fr-FR', options);
};

const goToDetails = (userId) => {
  router.push({ name: 'UserDetails', params: { id: userId } });
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Admin Users</h1>
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
      <tr v-for="user in users" :key="user.User_ID" class="clickable-row">
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
          <!-- Add more action buttons like edit, delete here -->
        </td>
      </tr>
      </tbody>
    </table>
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
</style>
