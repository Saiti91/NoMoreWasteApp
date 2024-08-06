<template>
  <HeaderComponent :logoSrc="logoSrc" logoAlt="Back Office Logo" logoText="Back Office" :profileSrc="profileSrc">
    <template #nav>
      <router-link class="item" to="/">{{ t('home') }}</router-link>
      <router-link class="item" to="/">{{ t('missions') }}</router-link>
      <router-link class="item" to="/">{{ t('recevoirDesDons') }}</router-link>
      <router-link class="item" to="/">{{ t('faireUnDon') }}</router-link>
    </template>
    <template #profile-dropdown>
      <router-link class="item" to="/profile">{{ t('monCompte') }}</router-link>
      <router-link class="item" to="/settings">{{ t('settings') }}</router-link>
      <div class="item" @click="logout">{{ t('logout') }}</div>
    </template>
  </HeaderComponent>
</template>

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

<style scoped>
/* Ajoutez ici des styles spécifiques si nécessaire */
</style>



<!--const token = Cookies.get('token');-->
<!--const isAuthenticated = ref(false);-->

<!--if (token) {-->
<!--  try {-->
<!--    const decodedToken = VueJwtDecode.decode(token);-->
<!--    const expirationTime = decodedToken.exp * 1000;-->
<!--    if (Date.now() < expirationTime) {-->
<!--      isAuthenticated.value = true;-->
<!--    } else {-->
<!--      Cookies.remove('token');-->
<!--    }-->
<!--  } catch (error) {-->
<!--    console.error('Invalid token', error);-->
<!--    Cookies.remove('token');-->
<!--  }-->
<!--}-->

<!--const logout = () => {-->
<!--  Cookies.remove('token');-->
<!--  isAuthenticated.value = false;-->
<!--  // Redirection après déconnexion-->
<!--  router.push('/'); // Utiliser le routeur pour rediriger vers la page d'accueil-->
<!--};-->

<!--</script>-->

<!--<template>-->
<!--  <div class="ui fixed menu">-->
<!--    <div class="ui container">-->
<!--      <router-link to="/" class="header item logo-container">-->
<!--       &lt;!&ndash; <img class="logo" src="/src/assets/logo.svg" alt="Company Logo"> &ndash;&gt;-->
<!--      </router-link>-->
<!--      <div class="right menu">-->
<!--        <router-link v-if="!isAuthenticated" to="/login" class="item">{{ $t('account_Login') }}</router-link>-->
<!--        <a v-if="isAuthenticated" @click="logout" class="item">{{ $t('logout') }}</a>-->
<!--        <router-link v-if="isAuthenticated" to="/my-account" class="item">{{ $t('account') }}</router-link>-->
<!--        <div class="ui simple dropdown item">-->
<!--          <i class="world icon"></i> {{ currentLocale }}-->
<!--          <div class="menu">-->
<!--            <div v-for="lang in availableLocales"-->
<!--                 :key="lang"-->
<!--                 class="item"-->
<!--                 @click="changeLocale(lang)">-->
<!--              {{ lang }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<style>-->
<!--.ui.menu {-->
<!--  background-color: #d9d9d9;-->
<!--  border-radius: 0;-->
<!--  border: none;-->
<!--}-->

<!--.logo-container {-->
<!--  width: 200px;-->
<!--  height: 70px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  padding: 0 !important;-->
<!--}-->

<!--.logo {-->
<!--  width: 100% !important;-->
<!--  height: 100% !important;-->
<!--  object-fit: cover;-->
<!--}-->
<!--</style>-->
