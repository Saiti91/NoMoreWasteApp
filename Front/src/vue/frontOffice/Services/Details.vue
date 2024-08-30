<script setup>
import ServiceMenu from "@/components/ServiceLeftMenu.vue";
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import { useI18n } from 'vue-i18n';
import Swal from "sweetalert2";
import Header from "@/components/HeaderFrontOffice.vue";
import useAuth from '@/components/Auth/useAuth';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();
const { userId } = useAuth();
const ticket = ref(null);
const skillName = ref('');
const isUserRegistered = ref(false);
const isOwner = ref(false);
const route = useRoute();
const router = useRouter();
const ticketId = route.params.id;
const imageLoaded = ref(true); // Track if the image is loaded successfully
const fullAddress = ref(''); // Store the full address

const statusMapping = {
  1: t('openRegistration'),
  2: t('registrationClosed'),
  3: t('completed')
};

// Fonction pour formater les dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const fetchSkillName = async (skillId) => {
  try {
    if (skillId === 1) {
      skillName.value = t('carSharing');
    } else {
      const skillResponse = await axios.get(`/skills/${skillId}`);
      skillName.value = skillResponse.data.Name;
    }
  } catch (error) {
    skillName.value = t('unknownSkill');
  }
};

const fetchTicketDetails = async () => {
  try {
    // Fetch ticket details
    const ticketResponse = await axios.get(`/tickets/${ticketId}`);
    ticket.value = ticketResponse.data;

    // Check if the user is the owner
    isOwner.value = ticket.value.Owner_User_ID === userId.value;

    // Fetch the skill name
    if (ticket.value.Skill_ID) {
      await fetchSkillName(ticket.value.Skill_ID);
    }

    // Fetch registrations for this ticket
    try {
      const registrationsResponse = await axios.get(`/registrations/ticket/${ticketId}`);
      const registrations = registrationsResponse.data;

      // Check if the user is already registered
      isUserRegistered.value = registrations.some(registration => registration.User_ID === userId.value);

      // If the user is registered and the address exists, construct the full address
      if (isUserRegistered.value && ticket.value.Address_ID) {
        fullAddress.value = `${ticket.value.Street}, ${ticket.value.Postal_Code} ${ticket.value.City}, ${ticket.value.Country}`;
      }

    } catch (error) {
      // If no registrations, the user is not registered
      isUserRegistered.value = false;
    }

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: t('errorFetchingTicket'),
      text: error.message,
    });
  }
};

const registerForTicket = async () => {
  try {
    await axios.post(`/registrations/${ticketId}/${userId.value}`);
    Swal.fire({
      icon: 'success',
      title: t('registrationSuccessful'),
      text: t('youHaveBeenRegistered'),
    });
    isUserRegistered.value = true;
    if (ticket.value.Address_ID) {
      fullAddress.value = `${ticket.value.Street}, ${ticket.value.Postal_Code} ${ticket.value.City}, ${ticket.value.Country}`;
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: t('errorRegistration'),
      text: error.message,
    });
  }
};

const unregisterForTicket = async () => {
  try {
    await axios.delete(`/registrations/${ticketId}/${userId.value}`);
    Swal.fire({
      icon: 'success',
      title: t('unregistrationSuccessful'),
    });
    isUserRegistered.value = false;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: t('errorUnregistration'),
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

onMounted(() => {
  fetchTicketDetails();
});
</script>

<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="main-container">
    <ServiceMenu />
    <div class="content-area">
      <div v-if="ticket" class="ticket-details">
        <h2>{{ ticket.Title }}</h2>
        <p><strong>{{ t('sujet') }} :</strong> {{ ticket.Description }}</p>
        <p><strong>{{ t('date') }} :</strong> {{ formatDate(ticket.Start_Date) }} {{ t('at') }} {{ ticket.Start_Time }}</p>
        <p v-if="ticket.End_Of_Subscription"><strong>{{ t('endOfSubscription') }}:</strong> {{ formatDate(ticket.End_Of_Subscription) }}</p>
        <p><strong>{{ t('duration') }} :</strong> {{ ticket.Duration }} {{ t('minutes') }}</p>
        <p v-if="ticket.Places !== 1"><strong>{{ t('places') }} :</strong> {{ ticket.Places }}</p>
        <p v-if="ticket.Tools"><strong>{{ t('tools') }} :</strong> {{ ticket.Tools }}</p>
        <p v-if="ticket.Status_ID"><strong>{{ t('registration') }} :</strong> {{ statusMapping[ticket.Status_ID] }}</p>
        <p v-if="skillName"><strong>{{ t('skill') }} :</strong> {{ skillName }}</p>

        <!-- Display the address based on conditions -->
        <p v-if="!isUserRegistered">
          <strong>{{ t('address') }} :</strong>
          {{ ticket.Address_ID ? t('onSite') : t('remote') }}
        </p>
        <p v-else>
          <strong>{{ t('address') }} :</strong>
          {{ fullAddress || t('remote') }}
        </p>

        <div class="ticket-image-container">
          <img v-if="imageLoaded" :src="getImageUrl(ticket.Ticket_ID)" alt="Ticket Image"
               class="ticket-image" @error="onImageError"/>
          <div v-else class="no-image">
            <i class="image outline icon"></i>
            <p>{{ t('noImage') }}</p>
          </div>
        </div>
        <div v-if="!isOwner">
          <button v-if="!isUserRegistered" class="ui teal button" @click="registerForTicket">
            {{ t('sign_up') }}
          </button>
          <button v-else class="ui red button" @click="unregisterForTicket">
            {{ t('unregister') }}
          </button>
        </div>
      </div>
      <div v-else>
        <p>{{ t('loading') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer_perso {
  margin: 7%;
}

.main-container {
  display: flex;
}

.content-area {
  flex-grow: 1;
  max-width: 800px; /* Limite la largeur maximale du contenu */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-left: auto; /* Centre horizontalement */
  margin-right: auto; /* Centre horizontalement */
  margin-top: 20px;
}

.ticket-details h2 {
  font-size: 2em;
  margin-bottom: 20px;
}

.ticket-details p {
  font-size: 1.2em;
  margin: 10px 0;
}

.ticket-details img {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}

.ui.button {
  margin-top: 20px;
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
</style>
