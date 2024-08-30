<script setup>
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import axios from '@/utils/Axios.js';
import Swal from 'sweetalert2';
import {useI18n} from 'vue-i18n';

const {t} = useI18n(); // Use i18n for translations

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
    return t('remote');
  }

  // Format the address if available
  return `${ticket.Street || ''}, ${ticket.City || ''}, ${ticket.State || ''}, ${ticket.Postal_Code || ''}, ${ticket.Country || ''}`.replace(/(,\s?)+$/, '');
};

// Function to fetch the ticket details
const fetchTicketDetails = async () => {
  if (!ticketId) {
    error.value = t('invalidTicketId');
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
    error.value = t('errorFetchingTicketDetails');
    console.error(t('errorFetchingTicketDetails'), err);
    loading.value = false;
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: error.value,
    });
  }
};

// Function to get the image URL with possible extensions
const getImageUrl = (imagePath) => {
  console.log(t('imagePath'), imagePath); // Log the image path
  if (!imagePath) {
    imageLoaded.value = false;
    return '';
  }

  const baseUrl = `${axios.defaults.baseURL}/uploads/tickets/`;
  const extensions = ['jpg', 'jpeg', 'png'];

  for (let extension of extensions) {
    const url = `${baseUrl}${imagePath}.${extension}`;
    console.log(t('tryingUrl'), url); // Log each URL tried
    return url;
  }

  imageLoaded.value = false;
  return ''; // If no valid image URL is found
};

// Function to handle image loading error
const onImageError = () => {
  imageLoaded.value = false;
  console.log(t('imageLoadFailed')); // Log when the image fails to load
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
      console.warn(t('noUsersRegistered'));
    } else {
      console.error(t('errorFetchingUsers'), err);
    }
  }
};

// Function to delete the ticket
const deleteTicket = async () => {
  try {
    await axios.delete(`/tickets/${ticketId}`);
    Swal.fire({
      icon: 'success',
      title: t('deleted'),
      text: t('ticketDeletedSuccessfully'),
    });
    router.push({name: 'ServicesAdmin'});
  } catch (err) {
    console.error(t('errorDeletingTicket'), err);
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: t('ticketDeleteError'),
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
    <div v-if="loading">{{ t('loading') }}</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div class="header-row">
        <h1>{{ t('ticketDetails') }}</h1>
        <button class="ui red button" @click="deleteTicket">{{ t('deleteTicket') }}</button>
      </div>
      <div class="ticket-detail-card">
        <div class="ticket-image-container">
          <img v-if="imageLoaded" :src="getImageUrl(ticketDetails.Ticket_ID)" :alt="t('ticketImage')"
               class="ticket-image" @error="onImageError"/>
          <div v-else class="no-image">
            <i class="image outline icon"></i>
            <p>{{ t('noImageForTicket') }}</p>
          </div>
        </div>
        <div class="ticket-details">
          <h2>{{ ticketDetails.Title }}</h2>
          <p><strong>{{ t('organizedBy') }}:</strong> {{ ticketDetails.OwnerFirstname }} {{ ticketDetails.OwnerName }}
          </p>
          <p><strong>{{ t('startDate') }}:</strong> {{ formatDate(ticketDetails.Start_Date) }}</p>
          <p><strong>{{ t('duration') }}:</strong> {{ ticketDetails.Duration }} {{ t('minutes') }}</p>
          <p><strong>{{ t('places') }}:</strong> {{ ticketDetails.Places }}</p>
          <p><strong>{{ t('toolsRequired') }}:</strong> {{ ticketDetails.Tools }}</p>
          <p><strong>{{ t('address') }}:</strong> {{ formatAddress(ticketDetails) }}</p>
          <p class="description">{{ ticketDetails.Description }}</p>
        </div>
      </div>

      <!-- Registered Users Table -->
      <div class="registered-users">
        <h3>{{ t('registeredUsers') }}</h3>
        <div v-if="registeredUsers.length > 0">
          <table class="ui celled table">
            <thead>
            <tr>
              <th>{{ t('lastName') }}</th>
              <th>{{ t('firstName') }}</th>
              <th>{{ t('email') }}</th>
              <th>{{ t('phone') }}</th>
              <th>{{ t('address') }}</th>
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
          <p>{{ t('noUsersRegisteredYet') }}</p>
        </div>
      </div>
    </div>
    <button class="ui button" @click="router.push({ name: 'ServicesAdmin' })">{{ t('back') }}</button>
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
