<template>
  <HeaderComponent :logoSrc="logoSrc" :profile-src="profileSrc" logoAlt="Back Office Logo"
                   logoText="Back Office" profile-alt="Icon Profile" profile-text="Profile">
    <template #nav>
      <router-link class="item" to="/users">{{ t('users') }}</router-link>
      <router-link class="item" to="/stocks">{{ t('stocks') }}</router-link>
      <router-link class="item" to="/don-requests">{{ t('don') }}</router-link>
      <router-link class="item" to="/tours">{{ t('tours') }}</router-link>
      <router-link class="item" to="/service-requests">{{ t('services') }}</router-link>
    </template>
  </HeaderComponent>
</template>

<script setup>
import HeaderComponent from './HeaderComponent.vue';
import {useI18n} from 'vue-i18n';

// Utilisation du composable useI18n pour accéder à la méthode t
const {t} = useI18n();
// Import dynamique de l'image du logo
const logoSrc = new URL('@/assets/logo.svg', import.meta.url).href;
const profileSrc = new URL('@/assets/user_profile_icon.svg', import.meta.url).href;
</script>

<style scoped>
/* Ajoutez ici des styles spécifiques si nécessaire */
</style>
