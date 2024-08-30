<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const isHoveredDonation = ref(false);
const isHoveredRequest = ref(false);

const navigateToDonation = () => {
  router.push('/donations-admin');
};

const navigateToRequest = () => {
  router.push('/requests-admin');
};
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="dashboard-container">
    <div class="ui two cards">
      <div
          class="ui huge card"
          @click="navigateToDonation"
          @mouseover="isHoveredDonation = true"
          @mouseleave="isHoveredDonation = false"
      >
        <div class="image icon-container">
          <i :class="['huge', 'hand', 'holding', 'heart', 'icon', { 'loading': isHoveredDonation }]"></i> <!-- Icône représentant les donations -->
        </div>
        <div class="content">
          <div class="header">{{ t('donations') }}</div>
          <div class="meta">
            <span class="category">{{ t('category') }}</span>
          </div>
          <div class="description">
            {{ t('navigationVersLesDons') }}
          </div>
        </div>
      </div>
      <div
          class="ui huge card"
          @click="navigateToRequest"
          @mouseover="isHoveredRequest = true"
          @mouseleave="isHoveredRequest = false"
      >
        <div class="image icon-container">
          <i :class="['huge', 'clipboard', 'list', 'icon', { 'loading': isHoveredRequest }]"></i> <!-- Icône représentant les demandes de don -->
        </div>
        <div class="content">
          <div class="header">{{ t('demandesDeDon') }}</div>
          <div class="meta">
            <span class="category">{{ t('category') }}</span>
          </div>
          <div class="description">
            {{ t('navigerverslesdemandesdedon') }}
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
