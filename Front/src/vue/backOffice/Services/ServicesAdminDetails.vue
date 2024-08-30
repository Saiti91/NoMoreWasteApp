<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import axios from '@/utils/Axios.js';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const ticketDetails = ref(null);
const registeredUsers = ref([]); // To store the registered users
const loading = ref(true);
const error = ref(null);
const imageLoaded = ref(true); // Track if the image is loaded successfully

// Get the ticket ID from the route parameters
const ticketId = route.params.id;

// Function to format the start date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Function to check if the address is empty and display "en distanciel" if so
const formatAddress = (ticket) => {
  if (!ticket.Street && !ticket.City && !ticket.State && !ticket.Postal_Code && !ticket.Country) {
    return "en distanciel";
  }

  // Format the address if available
  return `${ticket.Street || ''}, ${ticket.City || ''}, ${ticket.State || ''}, ${ticket.Postal_Code || ''}, ${ticket.Country || ''}`.replace(/(,\s?)+$/, '');
};

// Function to fetch the ticket details
const fetchTicketDetails = async () => {
  if (!ticketId) {
    error.value = 'Ticket ID non valide.';
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(`/tickets/${ticketId}`);
    ticketDetails.value = response.data;
    console.log('Ticket details:', ticketDetails.value);
    await fetchRegisteredUsers(); // Fetch users after getting ticket details
    loading.value = false;
  } catch (err) {
    error.value = 'Erreur lors de la récupération des détails du ticket.';
    console.error('Error fetching ticket details:', err);
    loading.value = false;
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.value,
    });
  }
};

// Function to get the image URL with possible extensions
const getImageUrl = (imagePath) => {
  console.log('Image path:', imagePath); // Log the image path
  if (!imagePath) {
    imageLoaded.value = false;
    return '';
  }

  const baseUrl = `${axios.defaults.baseURL}/uploads/tickets/`;
  const extensions = ['jpg', 'jpeg', 'png'];

  for (let extension of extensions) {
    const url = `${baseUrl}${imagePath}.${extension}`;
    console.log('Trying URL:', url); // Log each URL tried
    return url;
  }

  imageLoaded.value = false;
  return ''; // If no valid image URL is found
};

// Function to handle image loading error
const onImageError = () => {
  imageLoaded.value = false;
  console.log('Image failed to load'); // Log when the image fails to load
};

// Function to fetch registered users for the ticket
const fetchRegisteredUsers = async () => {
  try {
    const response = await axios.get(`/registrations/ticket/${ticketId}`);
    if (response.status === 200 && response.data.length > 0) {
      const userPromises = response.data.map(async registration => {
        const userResponse = await axios.get(`/users/${registration.User_ID}`);
        return userResponse.data;
      });
      registeredUsers.value = await Promise.all(userPromises); // Wait for all user fetches to complete
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.warn('Aucun utilisateur inscrit pour ce ticket.');
    } else {
      console.error('Error fetching registered users:', err);
    }
  }
};

// Function to delete the ticket
const deleteTicket = async () => {
  try {
    await axios.delete(`/tickets/${ticketId}`);
    Swal.fire({
      icon: 'success',
      title: 'Supprimé',
      text: 'Le ticket a été supprimé avec succès.',
    });
    router.push({name: 'ServicesAdmin'});
  } catch (err) {
    console.error('Error deleting ticket:', err);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la suppression du ticket.',
    });
  }
};

onMounted(() => {
  fetchTicketDetails();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="content-container">
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div class="header-row">
        <h1>Détails du Ticket</h1>
        <button class="ui red button" @click="deleteTicket">Supprimer le Ticket</button>
      </div>
      <div class="ticket-detail-card">
        <div class="ticket-image-container">
          <img v-if="imageLoaded" :src="getImageUrl(ticketDetails.Ticket_ID)" alt="Ticket Image"
               class="ticket-image" @error="onImageError"/>
          <div v-else class="no-image">
            <i class="image outline icon"></i>
            <p>Pas d'image pour ce ticket</p>
          </div>
        </div>
        <div class="ticket-details">
          <h2>{{ ticketDetails.Title }}</h2>
          <p><strong>Organisé par:</strong> {{ ticketDetails.OwnerFirstname }} {{ ticketDetails.OwnerName }}</p>
          <p><strong>Date de début:</strong> {{ formatDate(ticketDetails.Start_Date) }}</p>
          <p><strong>Durée:</strong> {{ ticketDetails.Duration }} minutes</p>
          <p><strong>Places:</strong> {{ ticketDetails.Places }}</p>
          <p><strong>Outils nécessaires:</strong> {{ ticketDetails.Tools }}</p>
          <p><strong>Adresse:</strong> {{ formatAddress(ticketDetails) }}</p>
          <p class="description">{{ ticketDetails.Description }}</p>
        </div>
      </div>

      <!-- Registered Users Table -->
      <div class="registered-users">
        <h3>Utilisateurs Inscrits</h3>
        <div v-if="registeredUsers.length > 0">
          <table class="ui celled table">
            <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in registeredUsers" :key="user.User_ID">
              <td>{{ user.Name }}</td>
              <td>{{ user.Firstname }}</td>
              <td>{{ user.Email }}</td>
              <td>{{ user.Phone }}</td>
              <td>{{ `${user.Street}, ${user.City}, ${user.State}, ${user.Postal_Code}, ${user.Country}` }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>Aucun utilisateur inscrit pour le moment.</p>
        </div>
      </div>
    </div>
    <button class="ui button" @click="router.push({ name: 'ServicesAdmin' })">Retour</button>
  </div>
</template>

<style scoped>
.content-container {
  width: 80%;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ticket-detail-card {
  display: flex;
  align-items: flex-start;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  gap: 20px;
}

.ticket-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  background-color: #eaeaea;
  text-align: center;
}

.ticket-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #aaa;
}

.no-image i.icon {
  font-size: 40px;
}

.ticket-details {
  flex: 1;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}

.ui.red.button:hover {
  background-color: #c82323;
}

.registered-users {
  margin-top: 20px;
}

.ui.celled.table {
  width: 100%;
  border-collapse: collapse;
}

.ui.celled.table th,
.ui.celled.table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
</style>
