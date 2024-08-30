<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute, useRouter } from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import UserMenu from "@/components/UserDetailsLeftMenu.vue";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n';
import * as XLSX from 'xlsx';

const user = ref(null);
const t = useI18n().t;
const route = useRoute();
const router = useRouter();
const schedule = ref([]);

const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`/users/${route.params.id}`);
    user.value = response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

const fetchUserSchedule = async () => {
  try {
    const response = await axios.get(`/users/${route.params.id}/schedule`);
    schedule.value = response.data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
  }
};

const generateExcel = () => {
  // Define the days of the week and time slots
  const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const timeSlots = [
    '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  // Initialize Excel data with headers
  const ws_data = [
    ['HEURE', 'Date', ...daysOfWeek]
  ];

  // Prepare an empty schedule grid
  const scheduleGrid = timeSlots.map(slot => [slot, '', '', '', '', '', '', '']);

  // Populate the schedule grid with events
  schedule.value.forEach(event => {
    const eventDate = new Date(event.date);
    const dayIndex = eventDate.getDay(); // getDay() returns 0-6 (0 = Sunday, 6 = Saturday)
    const timeSlotIndex = timeSlots.indexOf(event.time.slice(0, 5));

    // Map Sunday to the last column and adjust for Monday as the first day
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;

    if (adjustedDayIndex >= 0 && adjustedDayIndex < 7 && timeSlotIndex >= 0) {
      // Adjust the dayIndex to match the daysOfWeek array
      scheduleGrid[timeSlotIndex][adjustedDayIndex + 2] = `${event.title}` || `''}`; // +2 for correct column offset
    }
  });

  // Merge the header and the grid
  ws_data.push(...scheduleGrid);

  // Create a new workbook and a worksheet
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Weekly Schedule');

  // Write the workbook and trigger a download
  XLSX.writeFile(wb, `schedule_${user.value.Name}.xlsx`);
};

const formatDate = (date) => {
  if (!date) return t('noInfo');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  fetchUserDetails();
  fetchUserSchedule();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenu />
      <div class="content-area">
        <div class="header-section">
          <h2>{{ t('userDetails') }}</h2>
          <button @click="deleteUser" class="ui red button">{{ t('delete') }}</button>
        </div>
        <div v-if="user" class="user-details">
          <p><strong>{{ t('last-name') }} :</strong> {{ user.Name || t('noInfo') }}</p>
          <p><strong>{{ t('first-name') }} :</strong> {{ user.Firstname || t('noInfo') }}</p>
          <p><strong>{{ t('email') }} :</strong> {{ user.Email }}</p>
          <p><strong>{{ t('phone') }} :</strong> {{ user.Phone || t('noInfo') }}</p>
          <p><strong>{{ t('role') }} :</strong> {{ user.Role }}</p>
          <p><strong>{{ t('birthdate') }} :</strong> {{ formatDate(user.Birthdate) }}</p>
          <p><strong>{{ t('subscriptionStatus') }} :</strong>
            <span v-if="user.IsRegistered" class="status-active">{{ t('subscriber') }}</span>
            <span v-else class="status-inactive">{{ t('nonSubscriber') }}</span>
          </p>
          <h3>{{ t('address') }}</h3>
          <p><strong>{{ t('street') }} :</strong> {{ user.Street || t('noInfo') }}</p>
          <p><strong>{{ t('city') }} :</strong> {{ user.City || t('noInfo') }}</p>
          <p><strong>{{ t('state') }} :</strong> {{ user.State || t('noInfo') }}</p>
          <p><strong>{{ t('postalCode') }} :</strong> {{ user.Postal_Code || t('noInfo') }}</p>
          <p><strong>{{ t('country') }}:</strong> {{ user.Country || t('noInfo') }}</p>
          <button @click="generateExcel" class="ui green button">Télécharger le planning</button>
        </div>

        <router-view/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  margin: 20px 0;
}

.content-area {
  padding: 20px;
  margin-left: 50px;
  width: calc(70% - 50px);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-details {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
}

.user-details p {
  margin: 10px 0;
}

.user-details strong {
  display: inline-block;
  width: 150px;
  color: #333;
}

.status-active {
  color: green;
  font-weight: bold;
}

.status-inactive {
  color: red;
  font-weight: bold;
}

h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #4a4a4a;
}

h3 {
  margin-top: 20px;
  font-size: 1.5em;
  color: #333;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}

.ui.green.button {
  background-color: #21ba45;
  color: white;
}
</style>
