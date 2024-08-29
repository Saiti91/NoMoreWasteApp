<script setup>
import HeaderComponent from './HeaderComponent.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import useAuth from '@/components/Auth/useAuth';
import Cookies from "js-cookie"; // Importation de useAuth

const { t } = useI18n();

const logoSrc = new URL('@/assets/logoHeader.svg', import.meta.url).href;
const profileSrc = new URL('@/assets/user_profile_icon.svg', import.meta.url).href;

const router = useRouter();

const { isAuthenticated, userId } = useAuth(); // Utilisation de useAuth pour obtenir l'état d'authentification, l'ID utilisateur, et la fonction de déconnexion

function logout() {
  Cookies.remove('token');
  router.push('/');
}

onMounted(() => {
});
</script>

<template>
  <HeaderComponent :logoSrc="logoSrc" :profileSrc="profileSrc" logoAlt="Front Office Logo" logoText="Front Office" profile-alt="Profile icon">
    <template #nav>
      <router-link class="item" to="/mission">{{ t('missions') }}</router-link>
      <router-link class="item" to="/catalogue">{{ t('recevoirDesDons') }}</router-link>
      <router-link class="item" to="/donation">{{ t('faireUnDon') }}</router-link>
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
