<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n(); // Use i18n for translations

const tickets = ref([]);
const router = useRouter();

// Function to format the start date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Function to handle viewing ticket details (you might want to implement a detailed view later)
const viewTicketDetails = (ticketId) => {
  router.push(`/services-admin-details/${ticketId}`);
};

// Function to check if the address is empty and display "en distanciel" if so
const formatAddress = (ticket) => {
  if (!ticket.Street && !ticket.City && !ticket.State && !ticket.Postal_Code && !ticket.Country) {
    return t('remote');
  }

  // Format the address if available
  return `${ticket.Street || ''}, ${ticket.City || ''}, ${ticket.State || ''}, ${ticket.Postal_Code || ''}, ${ticket.Country || ''}`.replace(/(,\s?)+$/, '');
};

// Function to fetch the tickets
const fetchTickets = async () => {
  try {
    const response = await axios.get('/tickets');
    tickets.value = response.data;
    console.log('Tickets:', tickets.value);
  } catch (error) {
    console.error(t('errorFetchingTickets'), error);
  }
};

onMounted(() => {
  fetchTickets();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="content-container">
    <div class="header-row">
      <h1>{{ t('allTickets') }}</h1>
    </div>
    <div class="ticket-list">
      <div v-for="ticket in tickets" :key="ticket.Ticket_ID" class="ticket-card">
        <!-- Image removed -->
        <div class="ticket-details">
          <h2>{{ ticket.Title }}</h2>
          <p><strong>{{ t('organizedBy') }}:</strong> {{ ticket.OwnerFirstname }} {{ ticket.OwnerName }}</p>
          <p><strong>{{ t('startDate') }}:</strong> {{ formatDate(ticket.Start_Date) }}</p>
          <p><strong>{{ t('duration') }}:</strong> {{ ticket.Duration }} {{ t('minutes') }}</p>
          <p><strong>{{ t('places') }}:</strong> {{ ticket.Places }}</p>
          <p><strong>{{ t('toolsRequired') }}:</strong> {{ ticket.Tools }}</p>
          <p><strong>{{ t('address') }}:</strong> {{ formatAddress(ticket) }}</p>
          <p class="description">{{ ticket.Description }}</p>
          <button @click="viewTicketDetails(ticket.Ticket_ID)" class="view-ticket-button">{{ t('viewDetails') }}</button>
        </div>
      </div>
    </div>
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

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.ticket-card {
  display: flex;
  flex-direction: column; /* Change to column since there's no image */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 100%;
}

.ticket-details {
  flex: 1;
}

h1 {
  margin-top: 0;
  color: #333;
}

.view-ticket-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.view-ticket-button:hover {
  background-color: #45a049;
}

.description {
  color: #777;
  margin-top: 10px;
}
</style>
