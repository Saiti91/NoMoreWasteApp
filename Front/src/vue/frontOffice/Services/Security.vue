<script setup>
import ServiceMenu from "@/components/ServiceLeftMenu.vue";
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import { useI18n } from 'vue-i18n';
import Swal from "sweetalert2";
import Header from "@/components/HeaderFrontOffice.vue";
import useAuth from '@/components/Auth/useAuth';

const { t } = useI18n();
const { userId } = useAuth();
const tickets = ref([]);

const fetchTickets = async () => {
  try {
    console.log("Fetching all tickets...");
    const allTicketsResponse = await axios.get('/tickets');
    const allTickets = allTicketsResponse.data;
    console.log("All tickets fetched:", allTickets);

    const today = new Date().toISOString().split('T')[0];
    console.log("Today's date:", today);

    // Filter tickets based on Skill_ID and End_Of_Subscriptions
    const filteredTickets = allTickets.filter(ticket => {
      const isValidTicket = ticket.Skill_ID === 5 && new Date(ticket.End_Of_Subscription) >= new Date(today);
      console.log(`Ticket ${ticket.Ticket_ID} is valid:`, isValidTicket);
      return isValidTicket;
    });

    const availableTickets = [];

    for (const ticket of filteredTickets) {
      console.log(`Fetching registrations for ticket ${ticket.Ticket_ID}...`);
      const registrationsResponse = await axios.get(`/registrations/ticket/${ticket.Ticket_ID}`);
      const registrations = registrationsResponse.data;
      const registrationCount = registrations.length;
      console.log(`Number of registrations for ticket ${ticket.Ticket_ID}:`, registrationCount);

      // Vérifier si l'utilisateur est déjà inscrit
      const isUserAlreadyRegistered = registrations.some(registration => registration.User_ID === userId.value);
      if (isUserAlreadyRegistered) {
        console.log(`User ${userId.value} is already registered for ticket ${ticket.Ticket_ID}. Skipping this ticket.`);
        continue; // Ignorer ce ticket car l'utilisateur est déjà inscrit
      }

      if (registrationCount < ticket.Places && ticket.Owner_User_ID !== userId.value) {
        console.log(`Ticket ${ticket.Ticket_ID} is available.`);
        availableTickets.push(ticket);
      } else {
        console.log(`Ticket ${ticket.Ticket_ID} is not available or owned by the current user.`);
      }
    }

    tickets.value = availableTickets;
    console.log("Available tickets:", tickets.value);

  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error);
    Swal.fire({
      icon: 'error',
      title: t('errorFetchingTickets'),
      text: error.message,
    });
  }
};

const registerForTicket = async (ticketId) => {
  try {
    console.log(`Registering for ticket ${ticketId}...`);
    await axios.post(`/registrations/${ticketId}/${userId.value}`);
    Swal.fire({
      icon: 'success',
      title: t('registrationSuccessful'),
      text: t('youHaveBeenRegistered'),
    });
    console.log(`Successfully registered for ticket ${ticketId}.`);
    fetchTickets(); // Refresh the list of tickets after registration
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    Swal.fire({
      icon: 'error',
      title: t('errorRegistration'),
      text: error.message,
    });
  }
};

onMounted(() => {
  fetchTickets();
});
</script>


<template>
  <Header/>
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <ServiceMenu/>
      <div class="content-area">
        <h2>{{ t('security') }}</h2>
        <div v-if="tickets.length === 0" class="no-tickets-message">
          <i class="frown outline icon huge"></i>
          <p>{{ t('noTicketsAvailable') }}</p>
        </div>
        <div class="ui cards" v-else>
          <div v-for="ticket in tickets" :key="ticket.Ticket_ID" class="card">
            <div class="content">
              <div class="header">{{ ticket.Title }}</div>
              <div class="meta">{{ ticket.Category }}</div>
              <div class="description">{{ ticket.Description }}</div>
            </div>
            <div class="extra content">
              <button class="ui teal button" @click="registerForTicket(ticket.Ticket_ID)">
                {{ t('sign_up') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer_perso {
  margin: 7%;
}
.content-area {
  padding: 20px;
  margin-left: 7%;
  width: calc(70% - 50px);
}
.ui.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.card {
  margin: 10px;
  width: 300px;
}
.no-tickets-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px;
}

.no-tickets-message p {
  font-size: 1.5em;
  color: #555;
  margin-top: 10px;
}

.no-tickets-message i.icon {
  color: #555;
}
</style>
