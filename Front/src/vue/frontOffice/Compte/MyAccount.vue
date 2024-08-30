<script setup>
import {onMounted, ref} from 'vue';
import axios from '@/utils/Axios.js';
import {useRoute, useRouter} from 'vue-router';
import Header from "@/components/HeaderFrontOffice.vue";
import UserMenuFO from "@/components/UserDetailsLeftMenuFO.vue";
import Swal from "sweetalert2";
import {useI18n} from 'vue-i18n';
import * as XLSX from "xlsx";

const user = ref(null);
const originalUser = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showCurrentPassword = ref(false);
const showConfirmPassword = ref(false);
const t = useI18n().t;
const route = useRoute();
const router = useRouter();
const schedule = ref([]);

// Format the birthdate for the input field
const formatDateForInput = (date) => {
  if (!date) return '';
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// Fetch user details
const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`/users/${route.params.id}`);
    user.value = response.data;
    console.log(user.value)
    originalUser.value = {...response.data};
    user.value.Birthdate = formatDateForInput(user.value.Birthdate);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

// Validate fields before saving
const validateFields = () => {
  for (const key in originalUser.value) {
    if (originalUser.value[key] && !user.value[key]) {
      Swal.fire({
        icon: 'error',
        title: t('errorUpdateUserTitle'),
        text: t('errorUpdateUserLeftFields'),
      });
      return false;
    }
  }

  if (newPassword.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: t('errorUpdateUserTitle'),
      text: t('pwd-dont-match'),
    });
    return false;
  }

  return true;
};

// Update user details
const updateUserDetails = async () => {
  if (!validateFields()) return;

  const updateData = {
    first_name: user.value.Firstname,
    last_name: user.value.Name,
    email: user.value.Email,
    telephone: user.value.Phone,
    birthdate: user.value.Birthdate,
    address: {
      street: user.value.Street,
      city: user.value.City,
      state: user.value.State,
      postal_code: user.value.Postal_Code,
      country: user.value.Country,
    },
  };

  if (newPassword.value) {
    updateData.password = newPassword.value;
  }

  try {
    await axios.patch(`/users/${route.params.id}`, updateData);
    Swal.fire({
      icon: 'success',
      title: t('successUpdateUserTitle'),
      text: t('successUpdateUserTxt'),
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    Swal.fire({
      icon: 'error',
      title: t('errorUpdateUserTitle'),
      text: t('errorUpdateUserTxt'),
    });
  }
};

// Delete user account
const deleteUser = async () => {
  Swal.fire({
    title: t('popupDelUserFO'),
    text: t('popupDelUserTxt'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('yesDel'),
    cancelButtonText: t('cancel'),
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/users/${route.params.id}`);
        await validateSuppression();
        router.push('/users');
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
          icon: 'error',
          title: t('error_title'),
          text: t('errorDelTxt'),
        });
      }
    }
  });
};

const validateSuppression = () => {
  Swal.fire({
    icon: 'success',
    title: t('deleted'),
    text: t('successDelUserTxt'),
  });
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

onMounted(() => {
  fetchUserDetails();
});
</script>

<template>
  <Header/>
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenuFO/>
      <div class="content-area">
        <!-- User Information Section -->
        <div class="header-section">
          <h2>{{ t('userDetails') }}</h2>
          <button @click="deleteUser" class="ui red button">{{ t('delete') }}</button>
        </div>
        <div v-if="user" class="user-details">
          <p><strong>{{ t('last-name') }} :</strong>
            <input v-model="user.Name" type="text" class="ui input styled-input" required/>
          </p>
          <p><strong>{{ t('first-name') }} :</strong>
            <input v-model="user.Firstname" type="text" class="ui input styled-input" required/>
          </p>
          <p><strong>{{ t('email') }} :</strong>
            <input v-model="user.Email" type="email" class="ui input styled-input" required/>
          </p>
          <p><strong>{{ t('phone') }} :</strong>
            <input v-model="user.Phone" type="tel" class="ui input styled-input"/>
          </p>
          <p><strong>{{ t('birthdate') }} :</strong>
            <input v-model="user.Birthdate" type="date" class="ui input styled-input"/>
          </p>
          <p><strong>{{ t('subscriptionStatus') }} :</strong>
            <span v-if="user.IsRegistered" class="status-active">{{ t('subscriber') }}</span>
            <span v-else class="status-inactive">{{ t('nonSubscriber') }}</span>
          </p>
          <h3>{{ t('address') }}</h3>
          <p><strong>{{ t('street') }} :</strong>
            <input v-model="user.Street" type="text" class="ui input styled-input"/>
          </p>
          <p><strong>{{ t('city') }} :</strong>
            <input v-model="user.City" type="text" class="ui input styled-input"/>
          </p>
          <p><strong>{{ t('state') }} :</strong>
            <input v-model="user.State" type="text" class="ui input styled-input"/>
          </p>
          <p><strong>{{ t('postalCode') }} :</strong>
            <input v-model="user.Postal_Code" type="text" class="ui input styled-input"/>
          </p>
          <p><strong>{{ t('country') }}:</strong>
            <input v-model="user.Country" type="text" class="ui input styled-input"/>
          </p>

          <!-- Password Section -->
          <h3>{{ t('changePassword') }}</h3>
          <p><strong>{{ t('currentPassword') }} :</strong>
            <span>{{ showCurrentPassword ? user.Password : '********' }}</span>
            <i :class="showCurrentPassword ? 'eye slash icon' : 'eye icon'"
               @click="showCurrentPassword = !showCurrentPassword"></i>
          </p>
          <div class="password-section">
            <p>
              <strong>{{ t('newPassword') }} :</strong>
              <input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'"
                     class="ui input styled-input password-input"/>
              <i :class="showNewPassword ? 'eye slash icon' : 'eye icon'"
                 @click="showNewPassword = !showNewPassword"></i>
            </p>
            <p>
              <strong>{{ t('confirmPassword') }} :</strong>
              <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                     class="ui input styled-input password-input"/>
              <i :class="showConfirmPassword ? 'eye slash icon' : 'eye icon'"
                 @click="showConfirmPassword = !showConfirmPassword"></i>
            </p>
          </div>
          <button @click="updateUserDetails" class="ui teal button">{{ t('saveChanges') }}</button>
          <button @click="generateExcel" class="ui green button">Télécharger le planning</button>
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
  color : green;
}

.status-inactive {
  color : red;
}

.styled-input {
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 4px;
  width: calc(100% - 160px);
  margin-left: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.styled-input:focus {
  border-color: #00b5ad;
  box-shadow: 0 0 5px rgba(0, 181, 173, 0.5);
  outline: none;
}

.password-section p {
  display: flex;
  align-items: center;
}

.password-input {
  width: auto;
  flex-grow: 1;
  margin-left: 10px;
}

.eye.icon,
.eye.slash.icon {
  cursor: pointer;
  margin-left: 10px;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
  transition: background-color 0.3s ease;
}

.ui.red.button:hover {
  background-color: #c52222;
}

.ui.teal.button {
  background-color: #00b5ad;
  color: white;
  transition: background-color 0.3s ease;
}

.ui.teal.button:hover {
  background-color: #009a93;
}
</style>
