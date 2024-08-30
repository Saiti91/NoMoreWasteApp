<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const isHoveredPickup = ref(false);
const isHoveredDistribution = ref(false);

const navigateToPickup = () => {
  router.push('/pickup-tours');
};

const navigateToDistribution = () => {
  router.push('/distribution-tours');
};
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="dashboard-container">
    <div class="ui two cards">
      <div
          class="ui huge card"
          @click="navigateToPickup"
          @mouseover="isHoveredPickup = true"
          @mouseleave="isHoveredPickup = false"
      >
        <div class="image icon-container">
          <i :class="['huge', 'truck', 'icon', { 'loading': isHoveredPickup }]"></i>
        </div>
        <div class="content">
          <div class="header">{{ t('pickupTours') }}</div>
          <div class="meta">
            <span class="category">{{ t('category') }}</span>
          </div>
          <div class="description">
            {{ t('navigateToPickupTours') }}
          </div>
        </div>
      </div>
      <div
          class="ui huge card"
          @click="navigateToDistribution"
          @mouseover="isHoveredDistribution = true"
          @mouseleave="isHoveredDistribution = false"
      >
        <div class="image icon-container">
          <i :class="['huge', 'truck', 'icon', { 'loading': isHoveredDistribution }]"></i>
        </div>
        <div class="content">
          <div class="header">{{ t('distributionTours') }}</div>
          <div class="meta">
            <span class="category">{{ t('category') }}</span>
          </div>
          <div class="description">
            {{ t('navigateToDistributionTours') }}
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
