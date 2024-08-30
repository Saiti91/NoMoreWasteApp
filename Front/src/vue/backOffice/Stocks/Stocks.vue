<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const isHoveredStocks = ref(false);
const isHoveredCatalogue = ref(false);

const navigateToStocks = () => {
  router.push('/stocks-admin');
};

const navigateToCatalogue = () => {
  router.push('/catalogue-admin');
};
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="dashboard-container">
    <div class="ui two cards">
      <div
          class="ui huge card"
          @click="navigateToStocks"
          @mouseover="isHoveredStocks = true"
          @mouseleave="isHoveredStocks = false"
      >
        <div class="image icon-container">
          <i :class="['huge', 'boxes', 'icon', { 'loading': isHoveredStocks }]"></i> <!-- Icône représentant les stocks -->
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
      <div
          class="ui huge card"
          @click="navigateToCatalogue"
          @mouseover="isHoveredCatalogue = true"
          @mouseleave="isHoveredCatalogue = false"
      >
        <div class="image icon-container">
          <i :class="['huge', 'book', 'icon', { 'loading': isHoveredCatalogue }]"></i> <!-- Icône représentant le catalogue -->
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

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* Hauteur de l'icône pour correspondre à la taille de l'image */
  background-color: #f5f5f5; /* Fond gris clair pour imiter l'arrière-plan des images */
}

.icon-container i.icon {
  font-size: 6rem; /* Taille de l'icône */
  color: #555; /* Couleur de l'icône */
  width: 100%; /* Prend toute la largeur disponible */
  height: 100%; /* Prend toute la hauteur disponible */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
