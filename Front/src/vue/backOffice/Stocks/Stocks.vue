<script setup>
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import {useI18n} from 'vue-i18n';
import Stocks from "./Stocks.vue";

const {t} = useI18n();
const router = useRouter();

const navigateToStocks = () => {
  router.push('/stocks-admin');
};

const navigateToCatalogue = () => {
  router.push('/catalogue-admin');
};

onMounted(() => {
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="dashboard-container">
    <div class="ui two cards">
      <div class="ui huge card" @click="navigateToStocks">
        <div class="image">
          <img src="https://via.placeholder.com/400x200" alt="Pickup Image"> <!-- Placeholder image -->
        </div>
        <div class="content">
          <div class="header">{{ t('stocks') }}</div>
          <div class="meta">
            <span class="category">{{ t('category') }}</span>
          </div>
          <div class="description">
            {{ t('navigationverslesstocks') }}
          </div>
        </div>
      </div>
      <div class="ui huge card" @click="navigateToCatalogue">
        <div class="image">
          <img src="https://via.placeholder.com/400x200" alt="Distribution Image"> <!-- Placeholder image -->
        </div>
        <div class="content">
          <div class="header">{{ t('catalogue') }}</div>
          <div class="meta">
            <span class="category">{{ t('category') }}</span>
          </div>
          <div class="description">
            {{ t('navigationverslecatalogue') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.ui.two.cards {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px; /* Espacement entre les cartes */
}

.ui.huge.card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  width: 600px; /* Taille personnalisée pour la carte */
}

.ui.huge.card:hover {
  transform: translateY(-5px);
}

.ui.huge.card .image img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover; /* Assure que l'image occupe tout l'espace de son conteneur sans être déformée */
}
</style>
