<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute, useRouter } from 'vue-router';
import Header from "@/components/HeaderFrontOffice.vue";
import UserMenuFO from "@/components/UserDetailsLeftMenuFO.vue";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n';

const t = useI18n().t;
const tickets = ref([]);
const route = useRoute();
const router = useRouter();

const fetchUserParticipations = async () => {
  try {
    // Récupère les participations de l'utilisateur
    const registrationsResponse = await axios.get(`/registrations/user/${route.params.id}`);
    const ticketIds = registrationsResponse.data.map(registration => registration.Ticket_ID);

    // Récupère les détails de chaque ticket auquel l'utilisateur a participé
    const ticketDetailsPromises = ticketIds.map(ticketId => axios.get(`/tickets/${ticketId}`));
    const ticketDetailsResponses = await Promise.all(ticketDetailsPromises);

    // Stocke les détails des tickets
    tickets.value = ticketDetailsResponses.map(response => response.data);
    console.log(tickets.value);
  } catch (error) {
    console.error('Error fetching user participations:', error);
  }
};

const formatDate = (date) => {
  if (!date) return t('noInfo');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

const formatTime = (time) => {
  if (!time) return t('noInfo');
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('fr-FR', options);
};

const goToDetails = (ticketId) => {
  router.push({ name: 'TicketDetails', params: { id: ticketId } });
};

// Fonction pour se désinscrire d'un service
const unsubscribeFromTicket = async (ticketId) => {
  Swal.fire({
    title: t('popupUnsubscribeTitle'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('yesUnsubscribe'),
    cancelButtonText: t('cancel'),
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/registrations/${ticketId}/${route.params.id}`);
        Swal.fire({
          icon: 'success',
          title: t('unsubscribed'),
          text: t('successUnsubscribeMsg'),
        });
        fetchUserParticipations(); // Refresh list after unsubscribe
      } catch (error) {
        console.error('Error unsubscribing from ticket:', error);
        Swal.fire({
          icon: 'error',
          title: t('anErrorOccurred'),
          text: t('errorUnsubscribeMsg'),
        });
      }
    }
  });
};

onMounted(() => {
  fetchUserParticipations();
});
</script>

<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenuFO />
      <div class="content-area">
        <h2>{{ t('userParticipationsTitleFront') }}</h2>
        <div v-if="tickets.length > 0" class="user-details">
          <table class="ui celled table full-width-table">
            <thead>
            <tr>
              <th>{{ t('ticketTitle') }}</th>
              <th>{{ t('startDate') }}</th>
              <th>{{ t('startTime') }}</th>
              <th>{{ t('description') }}</th>
              <th>{{ t('actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="ticket in tickets" :key="ticket.Ticket_ID" class="clickable-row">
              <td @click="goToDetails(ticket.Ticket_ID)">{{ ticket.Title }}</td>
              <td @click="goToDetails(ticket.Ticket_ID)">{{ formatDate(ticket.Start_Date) }}</td>
              <td @click="goToDetails(ticket.Ticket_ID)">{{ formatTime(ticket.Start_Time) }}</td>
              <td @click="goToDetails(ticket.Ticket_ID)">{{ ticket.Description }}</td>
              <td>
                <button @click="unsubscribeFromTicket(ticket.Ticket_ID)" class="ui red button small">{{ t('unregister') }}</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>{{ t('noTicketsMsg') }}</p>
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
  margin-left: 50px;
  width: calc(70% - 50px);
}

.user-details {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
}

h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #4a4a4a;
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

.ui.celled.table.full-width-table th,
.ui.celled.table.full-width-table td {
  text-align: center;
  padding: 10px;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}

.ui.red.button:hover {
  background-color: #c82323;
}

p {
  font-size: 1.2em;
  color: #666;
}
</style>
