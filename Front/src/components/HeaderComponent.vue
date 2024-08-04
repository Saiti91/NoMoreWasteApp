<!-- src/components/HeaderComponent.vue -->
<template>
  <div class="ui top fixed menu">
    <div class="ui container">
      <router-link class="header item logo-container" to="/">
        <img :alt="logoAlt" class="logo" :src="logoSrc"> {{ logoText }}
      </router-link>
      <div class="right menu">
        <slot name="nav"></slot>
        <a class="item" @click="logout">{{ $t('logout') }}</a>
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

<script setup>
import { onMounted } from 'vue';
import { useLocale } from '@/composables/useLocale';
import { useRouter } from 'vue-router';
// import Cookies from 'js-cookie';

// Props
const props = defineProps({
  logoSrc: {
    type: String,
    required: true
  },
  logoAlt: {
    type: String,
    required: true
  },
  logoText: {
    type: String,
    required: false,
    default: ''
  }
});

// i18n setup
const { locale, availableLocales, changeLocale, currentLocale, t } = useLocale();

// Component setup
const router = useRouter();

onMounted(async () => {
  // Initialization code
});

// function logout() {
//   Cookies.remove('token');
//   router.push('/');
// }
</script>

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
  padding: 0 !important;
}

.logo {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}
</style>
