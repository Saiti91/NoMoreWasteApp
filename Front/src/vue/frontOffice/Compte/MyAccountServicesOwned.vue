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

const fetchUserTickets = async () => {
  try {
    const response = await axios.get(`/tickets/user/${route.params.id}`);
    tickets.value = response.data;
    console.log(tickets.value);
  } catch (error) {
    console.error('Error fetching user tickets:', error);
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

onMounted(() => {
  fetchUserTickets();
});
</script>

<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenuFO />
      <div class="content-area">
        <h2>{{ t('userTicketsTitleFront') }}</h2>
        <div v-if="tickets.length > 0" class="user-details">
          <table class="ui celled table full-width-table">
            <thead>
            <tr>
              <th>{{ t('ticketTitle') }}</th>
              <th>{{ t('startDate') }}</th>
              <th>{{ t('startTime') }}</th>
              <th>{{ t('description') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="ticket in tickets" :key="ticket.Ticket_ID" class="clickable-row" @click="goToDetails(ticket.Ticket_ID)">
              <td>{{ ticket.Title }}</td>
              <td>{{ formatDate(ticket.Start_Date) }}</td>
              <td>{{ formatTime(ticket.Start_Time) }}</td>
              <td>{{ ticket.Description }}</td>
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

p {
  font-size: 1.2em;
  color: #666;
}
</style>
