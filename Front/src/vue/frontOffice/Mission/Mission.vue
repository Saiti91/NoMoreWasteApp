<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import { useI18n } from 'vue-i18n';
import Swal from "sweetalert2";
import Header from "@/components/HeaderFrontOffice.vue";
import useAuth from '@/components/Auth/useAuth';

const missions = ref([]);
const { t } = useI18n();
const { userId } = useAuth();

const fetchMissions = async () => {
  try {
    const response = await axios.get('/tours');
    const allMissions = response.data;
    console.log("toutes les missions :", allMissions);
    const now = new Date();

    const filteredMissions = allMissions.filter(mission => {
      const routeDate = new Date(mission.Route_Date);
      const routeTime = new Date(`1970-01-01T${mission.Route_Time}`);

      // Si la date de la mission est dans le futur
      if (routeDate > now) {
        return mission.Driver.Driver_ID === null;
      }
      // Si la date de la mission est aujourd'hui, vérifier l'heure
      if (routeDate.toDateString() === now.toDateString()) {
        return mission.Driver.Driver_ID === null && routeTime > now;
      }

      // Sinon, ne pas inclure les missions
      return false;
    });
    console.log(filteredMissions);
    missions.value = filteredMissions;
    console.log(missions.value);
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
    fetchMissions(); // Re-fetch missions to update the UI
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
    fetchMissions(); // Re-fetch missions to update the UI
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
    <div class="ui cards">
      <div v-for="mission in missions" :key="mission.Route_ID" class="card">
        <div class="content">
          <div class="header">{{ t('missionDate', { date: new Date(mission.Route_Date).toLocaleDateString() }) }}</div>
          <div class="meta">{{ t('missionTime', { time: mission.Route_Time }) }}</div>
          <div class="description">
            <p>{{ t('missionType', { type: mission.Route_Type === 1 ? 'Type A' : 'Type B' }) }}</p>
            <p>{{ t('truckInfo', { model: mission.Truck.Truck_Model, registration: mission.Truck.Truck_Registration }) }}</p>
          </div>
        </div>
        <div class="extra content">
          <div class="ui two buttons">
            <button class="ui green button" @click="joinMission(mission.Route_ID)">{{ t('join') }}</button>
            <button class="ui red button" @click="leaveMission(mission.Route_ID)">{{ t('leave') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer_perso {
  margin-top: 5%;
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
