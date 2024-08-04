<!-- src/components/HeaderBackOffice.vue -->
<template>
  <HeaderComponent logoSrc="path/to/backoffice-logo.svg" logoAlt="Back Office Logo" logoText="Back Office">
    <template #nav>
      <router-link class="item" to="/stocks">{{ $t('stocks') }}</router-link>
      <router-link class="item" to="/users">{{ $t('users') }}</router-link>
      <router-link class="item" to="/don-requests">{{ $t('don_requests') }}</router-link>
      <router-link class="item" to="/tours">{{ $t('tours') }}</router-link>
      <router-link class="item" to="/service-requests">{{ $t('service_requests') }}</router-link>
    </template>
  </HeaderComponent>
</template>

<script setup>
import HeaderComponent from './HeaderComponent.vue';
</script>

<style scoped>
/* Ajoutez ici des styles spécifiques si nécessaire */
</style>
