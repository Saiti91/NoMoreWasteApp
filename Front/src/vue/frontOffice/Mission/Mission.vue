<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import { useI18n } from 'vue-i18n';
import Swal from "sweetalert2";
import Header from "@/components/HeaderFrontOffice.vue";
import useAuth from '@/components/Auth/useAuth';

const missionsToJoin = ref([]);
const missionsToLeave = ref([]);
const { t } = useI18n();
const { userId } = useAuth();

const formatDate = (date) => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (time) => {
  return time.slice(0, 5); // Supprimer les secondes de l'heure pour un affichage plus propre
};

const fetchMissions = async () => {
  try {
    const response = await axios.get('/tours');
    const allMissions = response.data;
    console.log("Toutes les missions:", allMissions);
    const now = new Date();

    const joinableMissions = [];
    const leaveableMissions = [];

    allMissions.forEach(mission => {
      const routeDate = new Date(mission.Route_Date);
      const routeTime = new Date(`1970-01-01T${mission.Route_Time}`);

      if (routeDate > now || (routeDate.toDateString() === now.toDateString() && routeTime > now)) {
        if (mission.Driver.Driver_ID === null) {
          joinableMissions.push(mission);
        } else if (mission.Driver.Driver_ID === userId.value) {
          leaveableMissions.push(mission);
        }
      }
    });

    missionsToJoin.value = joinableMissions;
    console.log("Missions à rejoindre:", missionsToJoin.value);
    missionsToLeave.value = leaveableMissions;
    console.log("Missions à quitter:", missionsToLeave.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des missions:', error);
  }
};

const joinMission = async (missionId) => {
  try {
    await axios.post(`/tours/${missionId}`, { Driver_ID: userId.value });
    Swal.fire({
      icon: 'success',
      title: t('missionJoined'),
      text: t('youHaveJoinedTheMission'),
    });
    fetchMissions();
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la mission:', error);
  }
};

const leaveMission = async (missionId) => {
  try {
    await axios.post(`/tours/${missionId}`, { Driver_ID: null });
    Swal.fire({
      icon: 'success',
      title: t('missionLeft'),
      text: t('youHaveLeftTheMission'),
    });
    fetchMissions();
  } catch (error) {
    console.error('Erreur lors de la désinscription de la mission:', error);
  }
};

onMounted(() => {
  fetchMissions();
});
</script>

<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="ui container">
    <div>
      <h2>{{ t('missionsToJoin') }}</h2>
      <div class="ui cards">
        <div v-for="mission in missionsToJoin" :key="mission.Route_ID" class="card">
          <div class="content">
            <div class="header">
              {{ formatDate(new Date(mission.Route_Date)) }}
            </div>
            <div class="meta">
              {{ formatTime(mission.Route_Time) }}
            </div>
            <div class="description">
              <p>{{ t('toursOf') }} {{ mission.Route_Type === 1 ? t('collect') : t('retail') }}</p>
              <p>{{ mission.Truck.Truck_Model }} - {{ mission.Truck.Truck_Registration }}</p>
            </div>
          </div>
          <div class="extra content">
            <div class="ui two buttons">
              <button class="ui teal button" @click="joinMission(mission.Route_ID)">
                {{ t('join') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 50px;">
      <h2>{{ t('missionsToLeave') }}</h2>
      <div class="ui cards">
        <div v-for="mission in missionsToLeave" :key="mission.Route_ID" class="card">
          <div class="content">
            <div class="header">
              {{ formatDate(new Date(mission.Route_Date)) }}
            </div>
            <div class="meta">
              {{ formatTime(mission.Route_Time) }}
            </div>
            <div class="description">
              <p>{{ t('toursOf') }} {{ mission.Route_Type === 1 ? t('collect') : t('retail') }}</p>
              <p>{{ mission.Truck.Truck_Model }} - {{ mission.Truck.Truck_Registration }}</p>
            </div>
          </div>
          <div class="extra content">
            <div class="ui two buttons">
              <button class="ui red button" @click="leaveMission(mission.Route_ID)">
                {{ t('leave') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer_perso {
  margin-top: 7%;
}

.ui.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.card {
  margin: 10px;
  width: 300px;
}
</style>
