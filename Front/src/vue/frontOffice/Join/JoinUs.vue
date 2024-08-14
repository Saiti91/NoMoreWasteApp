<script setup>
import axios from '@/utils/Axios.js';
import Header from "@/components/HeaderFrontOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';


const { t } = useI18n();

const navigateTo = (routeName) => {
  router.push({name: routeName});
};

</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <Header/>
    <div class="spacer"></div>
    <div class="ui stackable grid" style="text-align: center;">
      <div class="sixteen wide column">
        <h1>{{ $t('join-us') }}</h1>
      </div>
      <div v-if="isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-trust-property') }}</h2>
          <button class="ui primary button" @click="navigateTo('Join-Housing')">{{ $t('join-us-btn') }}</button>
        </div>
      </div>
      <div v-if="!isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-trust-property') }}</h2>
          <p>{{ $t('join-housing-txt') }}</p>
          <button class="ui primary button" @click="navigateTo('Login')">{{ $t('login') }}</button>
        </div>
      </div>
      <div v-if="isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-work-us') }}</h2>
          <button class="ui primary button" @click="navigateTo('Join-Provider')">{{ $t('join-us-btn') }}</button>
        </div>
      </div>
      <div v-if="!isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-work-us') }}</h2>
          <p>{{ $t('join-provider-txt') }}</p>
          <button class="ui primary button" @click="navigateTo('Login')">{{ $t('login') }}</button>
        </div>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 20%;
}

.ui.segment {
  margin: 20px 0;
}

button.ui.primary.button {
  margin-top: 10px;
}
</style>