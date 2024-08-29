<script setup>
import HeaderComponent from './HeaderComponent.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const { t } = useI18n();

const logoSrc = new URL('@/assets/logo.svg', import.meta.url).href;
const profileSrc = new URL('@/assets/user_profile_icon.svg', import.meta.url).href;

const router = useRouter();

function logout() {
  Cookies.remove('token');
  router.push('/');
}
</script>

<template>
  <HeaderComponent :logoSrc="logoSrc" logoAlt="Back Office Logo" logoText="Back Office" :profileSrc="profileSrc" profile-alt="icon profile">
    <template #nav>
      <router-link class="item" to="/trucks-admin">{{ t('trucks') }}</router-link>
      <router-link class="item" to="/users">{{ t('users') }}</router-link>
      <router-link class="item" to="/stocks">{{ t('stocks') }}</router-link>
      <router-link class="item" to="/donation-admin">{{ t('don') }}</router-link>
      <router-link class="item" to="/tour-admin">{{ t('tours') }}</router-link>
      <router-link class="item" to="/recipes-admin">{{ t('recettes') }}</router-link>
      <router-link class="item" to="/skills-admin">{{ t('competence') }}</router-link>
      <router-link class="item" to="/services-admin">{{ t('services') }}</router-link>

    </template>
    <template #profile-dropdown>
<!--      <router-link class="item" to="/profile">{{ t('monCompte') }}</router-link>-->
      <div class="item" @click="logout">{{ t('logout') }}</div>
    </template>
  </HeaderComponent>
</template>

<style scoped>
</style>
