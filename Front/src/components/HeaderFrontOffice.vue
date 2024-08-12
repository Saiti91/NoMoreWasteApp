<template>
  <HeaderComponent :logoSrc="logoSrc" :profileSrc="profileSrc" logoAlt="Front Office Logo" logoText="Front Office" profile-alt="Profile icon">
    <template #nav>
      <router-link class="item" to="/">{{ t('home') }}</router-link>
      <router-link class="item" to="/">{{ t('missions') }}</router-link>
      <router-link class="item" to="/catalogue">{{ t('recevoirDesDons') }}</router-link>
      <router-link class="item" to="/donation">{{ t('faireUnDon') }}</router-link>
    </template>
    <template #profile-dropdown>
      <router-link v-if="isAuthenticated" class="item" to="/my-account">{{ t('monCompte') }}</router-link>
      <div v-if="isAuthenticated" class="item" @click="logout">{{ t('logout') }}</div>
      <router-link v-else class="item" to="/login">{{ t('login') }}</router-link>
    </template>
  </HeaderComponent>
</template>

<script setup>
import HeaderComponent from './HeaderComponent.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import VueJwtDecode from 'vue-jwt-decode';

const { t } = useI18n();

const logoSrc = new URL('@/assets/logoHeader.svg', import.meta.url).href;
const profileSrc = new URL('@/assets/user_profile_icon.svg', import.meta.url).href;

const router = useRouter();

const token = Cookies.get('token');
const isAuthenticated = ref(false);

if (token) {
  try {
    const decodedToken = VueJwtDecode.decode(token);
    const expirationTime = decodedToken.exp * 1000;
    if (Date.now() < expirationTime) {
      isAuthenticated.value = true;
    } else {
      Cookies.remove('token');
    }
  } catch (error) {
    console.error('Invalid token', error);
    Cookies.remove('token');
  }
}

const logout = () => {
  Cookies.remove('token');
  isAuthenticated.value = false;
  router.push('/'); // Utiliser le routeur pour rediriger vers la page d'accueil
};

onMounted(() => {
  if (token) {
    try {
      const tokendecode =  VueJwtDecode.decode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
});
</script>

<style scoped>
/* Ajoutez ici des styles spécifiques si nécessaire */
</style>
