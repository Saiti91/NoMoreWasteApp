<script setup>
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="container">
    <!-- Info sur le Backoffice -->
    <section class="segment">
      <h1 class="header">{{ t('backoffice_dashboard') }}</h1>
      <p class="text-container">{{ t('welcome_message_backoffice') }}</p>
    </section>

    <!-- Outils d'administration -->
    <section class="segment">
      <h2 class="header">{{ t('admin_tools') }}</h2>
      <div class="grid">
        <router-link to="/trucks-admin" class="column">
          <div class="icon-header">
            <i class="truck icon"></i>{{ t('trucks') }}
          </div>
          <p>{{ t('manageTrucks') }}</p>
        </router-link>
        <router-link to="/users" class="column">
          <div class="icon-header">
            <i class="users icon"></i>{{ t('users') }}
          </div>
          <p>{{ t('manageUsers') }}</p>
        </router-link>
        <router-link to="/stocks" class="column">
          <div class="icon-header">
            <i class="warehouse icon"></i>{{ t('stocks') }}
          </div>
          <p>{{ t('manage_stocks') }}</p>
        </router-link>
        <router-link to="/donation-admin" class="column">
          <div class="icon-header">
            <i class="donate icon"></i>{{ t('donations') }}
          </div>
          <p>{{ t('manage_donations') }}</p>
        </router-link>
        <router-link to="/tour-admin" class="column">
          <div class="icon-header">
            <i class="map marker alternate icon"></i>{{ t('tours') }}
          </div>
          <p>{{ t('manage_tours') }}</p>
        </router-link>
        <router-link to="/recipes-admin" class="column">
          <div class="icon-header">
            <i class="utensils icon"></i>{{ t('recipes') }}
          </div>
          <p>{{ t('manage_recipes') }}</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.segment {
  padding: 40px 0;
  width: 100%;
  max-width: 1200px;
}

.header {
  text-align: center;
  color: teal;
}

.text-container {
  text-align: center;
  margin-bottom: 20px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centre les éléments horizontalement */
  gap: 20px;
  width: 100%;
}

.column {
  flex: 1 1 calc(25% - 40px); /* Chaque élément occupe environ 25% de la largeur */
  max-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  transition: background-color 0.3s;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.column:hover {
  background-color: #f4f4f4;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.icon-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-header .icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: teal;
}

.column p {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}
</style>
