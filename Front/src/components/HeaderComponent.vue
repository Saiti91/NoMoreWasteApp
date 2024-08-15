<script setup>
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const props = defineProps({
  logoSrc: {
    type: String,
    required: true,
  },
  logoAlt: {
    type: String,
    required: true,
  },
  logoText: {
    type: String,
    required: false,
    default: '',
  },
  profileSrc: {
    type: String,
    required: true,
  },
  profileAlt: {
    type: String,
    required: true,
  },
  profileText: {
    type: String,
    required: false,
    default: '',
  },
});

const {locale, availableLocales, currentLocale} = useI18n();

const router = useRouter();
const route = useRoute();

const isAdmin = ref(false);

onMounted(() => {
  const token = Cookies.get('token');
  if (token) {
    try {
      const decodedToken = VueJwtDecode.decode(token);

      if (decodedToken.urole) {
        if (decodedToken.urole === 'admin') {
          isAdmin.value = true;
        }
      } else {
        console.error('Token does not contain urole property');
      }
    } catch (error) {
      console.error('Invalid token', error);
    }
  }
  $('.ui.dropdown').dropdown();
});

const changeLocale = (lang) => {
  locale.value = lang;
};

const handleLogoClick = () => {
  if (isAdmin.value && route.path !== '/back-office') {
    router.push('/back-office');
  } else {
    router.push('/');
  }
};

const logout = () => {
  Cookies.remove('token');
  router.push('/');
};
</script>

<template>
  <div class="ui top fixed menu">
    <div class="ui container">
      <div class="header item logo-container" @click="handleLogoClick">
        <img :alt="logoAlt" :src="logoSrc" class="logo">
      </div>
      <div class="right menu">
        <slot name="nav"></slot>
        <div class="ui simple dropdown item">
          <img :alt="profileAlt" :src="profileSrc" class="ui avatar image">
          <div class="menu">
            <slot name="profile-dropdown">
              <!-- Default content if no slot is provided -->
              <div class="item" @click="logout">{{ t('logout') }}</div>
            </slot>
          </div>
        </div>
        <div class="ui simple dropdown item">
          <i class="world icon"></i> {{ currentLocale }}
          <div class="menu">
            <div
                v-for="lang in availableLocales"
                :key="lang"
                class="item"
                @click="changeLocale(lang)"
            >
              {{ lang }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui.menu {
  background-color: #d9d9d9;
  border-radius: 0;
  border: none;
}

.logo-container {
  width: 250px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 !important;
}

.logo {
  object-fit: cover;
}

.ui.avatar.image {
  width: 35px;
  height: 35px;
}
</style>
