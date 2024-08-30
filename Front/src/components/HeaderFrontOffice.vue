<script setup>
import HeaderComponent from './HeaderComponent.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useAuth from '@/components/Auth/useAuth';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";

const { t } = useI18n();

const logoSrc = new URL('@/assets/logoHeader.svg', import.meta.url).href;
const profileSrc = new URL('@/assets/user_profile_icon.svg', import.meta.url).href;

const router = useRouter();

const { isAuthenticated, userId, isSubscribed } = useAuth();

function logout() {
  Cookies.remove('token');
  router.push('/');
}

// Intercepter le clic sur le lien "Nos petits plus"
function handleMoreClick(event) {
  event.preventDefault(); // Empêche toute navigation par défaut
  if (!isSubscribed.value) {
    // Afficher la pop-up d'alerte
    Swal.fire({
      icon: 'info',
      title: t('subscriptionRequired'),
      text: t('pleaseSubscribeToAccess'),
    });
  } else {
    // Si l'utilisateur est abonné, naviguer vers la page
    router.push('/advice');
  }
}
</script>


<template>
  <HeaderComponent :logoSrc="logoSrc" :profileSrc="profileSrc" logoAlt="Front Office Logo" logoText="Front Office" profile-alt="Profile icon">
    <template #nav>
      <router-link class="item" to="/mission">{{ t('missions') }}</router-link>
      <router-link class="item" to="/catalogue">{{ t('recevoirDesDons') }}</router-link>
      <router-link class="item" to="/donation">{{ t('faireUnDon') }}</router-link>
      <!-- Intercepter le clic sur "Nos petits plus" -->
      <a class="item" @click="handleMoreClick">{{ t('more') }}</a>
      <router-link class="item" to="/join-us">{{ t('join_us') }}</router-link>
    </template>
    <template #profile-dropdown>
      <router-link v-if="isAuthenticated" class="item" :to="`/my-account/${userId}`">{{ t('monCompte') }}</router-link>
      <div v-if="isAuthenticated" class="item" @click="logout">{{ t('logout') }}</div>
      <router-link v-else class="item" to="/login">{{ t('login') }}</router-link>
    </template>
  </HeaderComponent>
</template>

<style scoped>
</style>
