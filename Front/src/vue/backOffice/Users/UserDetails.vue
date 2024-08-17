<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute, useRouter } from 'vue-router';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import UserMenu from "@/components/UserDetailsLeftMenu.vue";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n';

const user = ref(null);
const t = useI18n().t;
const route = useRoute();
const router = useRouter();

const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`/users/${route.params.id}`);
    user.value = response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

const deleteUser = async () => {
  Swal.fire({
    title: t('Êtes-vous sûr de vouloir supprimer cet utilisateur ?'),
    text: t("Cette action est irréversible!"),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('Oui, supprimer!'),
    cancelButtonText: t('Annuler')
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/users/${route.params.id}`);
        await validateSuppression();
        router.push('/users');
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
          icon: 'error',
          title: t('Erreur'),
          text: t('Erreur lors de la suppression de l\'utilisateur'),
        });
      }
    }
  });
};

const validateSuppression = () => {
  // Afficher une pop-up de confirmation de suppression
  Swal.fire({
    icon: 'success',
    title: t('Supprimé!'),
    text: t('L\'utilisateur a bien été supprimé.'),
  });
};

const formatDate = (date) => {
  if (!date) return 'Non renseigné';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  fetchUserDetails();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenu />
      <div class="content-area">
        <div class="header-section">
          <h2>Détails de l'utilisateur</h2>
          <button @click="deleteUser" class="ui red button">Supprimer</button>
        </div>
        <div v-if="user" class="user-details">
          <p><strong>Nom :</strong> {{ user.Name || 'Non renseigné' }}</p>
          <p><strong>Prénom :</strong> {{ user.Firstname || 'Non renseigné' }}</p>
          <p><strong>Email :</strong> {{ user.Email }}</p>
          <p><strong>Téléphone :</strong> {{ user.Phone || 'Non renseigné' }}</p>
          <p><strong>Rôle :</strong> {{ user.Role }}</p>
          <p><strong>Date de naissance :</strong> {{ formatDate(user.Birthdate) }}</p>
          <p><strong>Statut de l'abonnement :</strong>
            <span v-if="user.Current_Subscription" class="status-active">Abonné</span>
            <span v-else>Non Abonné</span>
          </p>
          <h3>Adresse</h3>
          <p><strong>Rue :</strong> {{ user.Street || 'Non renseigné' }}</p>
          <p><strong>Ville :</strong> {{ user.City || 'Non renseigné' }}</p>
          <p><strong>État :</strong> {{ user.State || 'Non renseigné' }}</p>
          <p><strong>Code Postal :</strong> {{ user.Postal_Code || 'Non renseigné' }}</p>
          <p><strong>Pays :</strong> {{ user.Country || 'Non renseigné' }}</p>
        </div>

        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  margin: 20px 0;
}

/* Adjustments to ensure the content area does not overlap with the menu */
.content-area {
  padding: 20px;
  margin-left: 50px; /* Match this with the actual width of the menu */
  width: calc(70% - 50px); /* Ensure this calculation takes into account the menu's width */
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-details {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
}

.user-details p {
  margin: 10px 0;
}

.user-details strong {
  display: inline-block;
  width: 150px;
  color: #333;
}

.status-active {
  color: green;
  font-weight: bold;
}

.status-inactive {
  color: red;
  font-weight: bold;
}

h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #4a4a4a;
}

h3 {
  margin-top: 20px;
  font-size: 1.5em;
  color: #333;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}
</style>
