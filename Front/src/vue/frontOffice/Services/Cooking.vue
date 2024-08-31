<script setup>
import ServiceMenu from "@/components/ServiceLeftMenu.vue";
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useI18n } from 'vue-i18n';
import Swal from "sweetalert2";
import Header from "@/components/HeaderFrontOffice.vue";
import useAuth from '@/components/Auth/useAuth';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const { userId } = useAuth();
const tickets = ref([]);
const router = useRouter();

const fetchTickets = async () => {
  try {
    const allTicketsResponse = await axios.get('/tickets');
    const allTickets = allTicketsResponse.data;
    console.log(allTickets);

    const today = new Date().toISOString().split('T')[0];

    // Filtrer les tickets en fonction de Skill_ID et End_Of_Subscriptions
    const filteredTickets = allTickets.filter(ticket => {
      return ticket.Skill_ID === 2 && new Date(ticket.End_Of_Subscription) >= new Date(today);
    });

    const availableTickets = [];

    for (const ticket of filteredTickets) {
      let registrationCount = 0;
      let isUserAlreadyRegistered = false;

      try {
        const registrationsResponse = await axios.get(`/registrations/ticket/${ticket.Ticket_ID}`);
        const registrations = registrationsResponse.data;
        registrationCount = registrations.length;

        // Vérifier si l'utilisateur est déjà inscrit
        isUserAlreadyRegistered = registrations.some(registration => registration.User_ID === userId.value);
      } catch (error) {
        console.error('Erreur lors de la récupération des inscriptions:', error);
        // Ignorer l'erreur et continuer
      }

      // Ajouter le ticket si l'utilisateur n'est pas déjà inscrit et que le nombre de places n'est pas atteint
      if (!isUserAlreadyRegistered && ticket.Owner_User_ID !== userId.value) {
        availableTickets.push(ticket);
      }
    }

    // Vérification supplémentaire pour s'assurer que les tickets filtrés sont ajoutés à la liste finale
    tickets.value = availableTickets.length ? availableTickets : filteredTickets;

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: t('errorFetchingTickets'),
      text: error.message,
    });
  }
};

const goToServiceDetails = (ticketId) => {
  router.push(`/service-details/${ticketId}`);
};

// Rediriger vers la création de ticket
const goToCreateTicket = () => {
  router.push('/create-ticket');
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
        <div class="header-section">
          <h2>{{ t('cookingLesson') }}</h2>
          <button class="ui teal button" @click="goToCreateTicket">
            {{ t('createTicketPropose') }}
          </button>
        </div>
        <div v-if="tickets.length === 0" class="no-tickets-message">
          <i class="frown outline icon huge"></i>
          <p>{{ t('noTicketsAvailable') }}</p>
        </div>
        <div v-else class="ui cards">
          <div v-for="ticket in tickets" :key="ticket.Ticket_ID" class="card">
            <div class="content">
              <div class="header">{{ ticket.Title }}</div>
              <div class="meta">{{ ticket.Category }}</div>
              <div class="description">{{ ticket.Description }}</div>
            </div>
            <div class="extra content">
              <button class="ui teal button" @click="goToServiceDetails(ticket.Ticket_ID)">
                {{ t('details') }}
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
