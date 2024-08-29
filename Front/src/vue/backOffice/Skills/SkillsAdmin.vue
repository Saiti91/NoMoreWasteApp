<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import Swal from "sweetalert2";
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useI18n } from 'vue-i18n';

const t = useI18n().t;
const unvalidatedSkills = ref([]);

const fetchUnvalidatedSkills = async () => {
  try {
    const response = await axios.get('/skills/unvalidated');
    unvalidatedSkills.value = response.data;
  } catch (error) {
    console.error('Error fetching unvalidated skills:', error);
  }
};

const validateSkill = async (userId, skillId) => {
  try {
    await axios.patch(`/skills/user/${userId}/skill/${skillId}/validate`);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Skill validated successfully!',
    });
    fetchUnvalidatedSkills(); // Refresh the list after action
  } catch (error) {
    console.error('Error validating skill:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error validating the skill.',
    });
  }
};

const rejectSkill = async (userId, skillId) => {
  try {
    await axios.delete(`/skills/user/${userId}/${skillId}`);
    Swal.fire({
      icon: 'success',
      title: 'Rejected',
      text: 'Skill rejected and removed successfully!',
    });
    fetchUnvalidatedSkills(); // Refresh the list after action
  } catch (error) {
    console.error('Error rejecting skill:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error rejecting the skill.',
    });
  }
};

onMounted(() => {
  fetchUnvalidatedSkills();
});
</script>

<template>
  <HeaderBackOffice />
  <div class="spacer"></div>
  <div class="content-container">
    <div class="header-row">
      <h1>{{ t('unvalidatedSkillsManagement') }}</h1>
    </div>
    <div class="skills-list">
      <div v-for="skill in unvalidatedSkills" :key="skill.Skill_ID" class="skill-card">
        <div class="skill-details">
          <h2>{{ skill.Skill_Name }}</h2>
          <p><strong>User:</strong> {{ skill.User_Name }}</p>
          <p><strong>Email:</strong> {{ skill.User_Email }}</p>
          <p><strong>Document:</strong>
            <a :href="`http://${axios.defaults.baseURL}:3000/uploads/justificatif/${skill.User_ID}/${skill.Document_Path}`"
               target="_blank">
              View Document
            </a>
          </p>
          <div class="actions">
            <button @click="validateSkill(skill.User_ID, skill.Skill_ID)" class="approve-button">Approve</button>
            <button @click="rejectSkill(skill.User_ID, skill.Skill_ID)" class="reject-button">Reject</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-container {
  width: 80%;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.skill-card {
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  gap: 10px;
}

.skill-details {
  flex: 1;
}

h1 {
  margin-top: 0;
  color: #333;
}

.approve-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.reject-button {
  background-color: #E74C3C;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
}

.approve-button:hover {
  background-color: #45a049;
}

.reject-button:hover {
  background-color: #c0392b;
}

.actions {
  margin-top: 10px;
}

p {
  color: #555;
}
</style>
