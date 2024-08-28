<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import { useI18n } from 'vue-i18n';
import Swal from "sweetalert2";
import Header from "@/components/HeaderFrontOffice.vue";
import useAuth from '@/components/Auth/useAuth';

const missionsToJoin = ref([]);
const missionsToLeave = ref([]);
const hasDrivingLicense = ref(false);
const { t } = useI18n();
const { userId, isAuthenticated } = useAuth();

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

const checkDrivingLicense = async () => {
  try {
    const response = await axios.get(`/skills/user/${userId.value}`);
    const userSkills = response.data;
    hasDrivingLicense.value = userSkills.some(skill => skill.Skill_ID === 1);
  } catch (error) {
    console.error('Erreur lors de la vérification du permis de conduire:', error);
  }
};

const fetchMissions = async () => {
  try {
    const response = await axios.get('/tours');
    const allMissions = response.data;
    const now = new Date();

    const joinableMissions = [];
    const leaveableMissions = [];

    allMissions.forEach(mission => {
      const routeDate = new Date(mission.Route_Date);
      const routeTime = mission.Route_Time.split(':');
      const missionDateTime = new Date(routeDate.getFullYear(), routeDate.getMonth(), routeDate.getDate(), routeTime[0], routeTime[1]);

      if (missionDateTime > now) {
        if (mission.Driver.Driver_ID === null) {
          joinableMissions.push(mission);
        } else if (mission.Driver.Driver_ID === userId.value) {
          leaveableMissions.push(mission);
        }
      }
    });

    missionsToJoin.value = joinableMissions;
    missionsToLeave.value = leaveableMissions;
  } catch (error) {
    console.error('Erreur lors de la récupération des missions:', error);
  }
};

const joinMission = async (missionId) => {
  try {
    console.log(userId.value);
    console.log(missionId);
    await axios.put(`/tours/${missionId}`, { User_ID : userId.value });
    Swal.fire({
      icon: 'success',
      title: t('missionJoined'),
    });
    fetchMissions();
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la mission:', error);
  }
};

const leaveMission = async (missionId) => {
  try {
    await axios.put(`/tours/${missionId}`, { User_ID : null });
    Swal.fire({
      icon: 'success',
      title: t('missionLeft'),
    });
    fetchMissions();
  } catch (error) {
    console.error('Erreur lors de la désinscription de la mission:', error);
  }
};

onMounted(async () => {
  if (isAuthenticated.value) {
    await checkDrivingLicense();
    if (hasDrivingLicense.value) {
      await fetchMissions();
    }
  }
});
</script>

<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="ui container">
    <div v-if="!isAuthenticated" class="centered-message">
      <i class="user icon"></i>
      <p>{{ t('pleaseLogin') }}</p>
    </div>

    <div v-else-if="!hasDrivingLicense" class="centered-message">
      <i class="car icon"></i>
      <p>{{ t('noDrivingLicenseMessage') }}</p>
    </div>

    <div v-else>
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

.centered-message {
  text-align: center;
  font-size: 1.5em;
  color: #555;
  margin: 50px 0;
}

.centered-message i.icon {
  font-size: 3em;
  color: #666;
  margin-bottom: 20px;
}
</style>
