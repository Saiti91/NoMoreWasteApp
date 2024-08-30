<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute } from 'vue-router';
import Header from "@/components/HeaderBackOffice.vue";
import UserMenu from "@/components/UserDetailsLeftMenu.vue";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n';

const t = useI18n().t;
const route = useRoute();
const userSkills = ref([]);

// Fetch user-specific skills
const fetchUserSkills = async () => {
  try {
    const userSkillsResponse = await axios.get(`/skills/user/${route.params.id}`);
    userSkills.value = userSkillsResponse.data;
    console.log('User skills:', userSkills.value);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn('No skills found for user:', route.params.id);
      userSkills.value = [];
    } else {
      console.error('Error fetching user skills:', error);
    }
  }
};

// Delete a skill
const deleteSkill = async (skillId) => {
  Swal.fire({
    title: t('popupDelSkillTitle'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('yesDel'),
    cancelButtonText: t('cancel'),
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/skills/user/${route.params.id}/${skillId}`);
        await fetchUserSkills();
        Swal.fire({
          icon: 'success',
          title: t('deleted'),
          text: t('successDeleteSkillTxt'),
        });
      } catch (error) {
        console.error('Error deleting skill:', error);
        Swal.fire({
          icon: 'error',
          title: t('anErrorOccurred'),
          text: t('orderErrorMessage'),
        });
      }
    }
  });
};

onMounted(() => {
  fetchUserSkills();
});
</script>

<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenu />
      <div class="content-area">
        <h2>{{ t('skillsmanagement') }}</h2>
        <div class="skills-section">
          <div v-if="userSkills.length > 0">
            <h4>{{ t('validatedSkills') }}</h4>
            <ul>
              <li v-for="skill in userSkills" :key="skill.Skill_ID">
                {{ skill.Name }} -
                <!-- Check if Validation_Date is null -->
                <span v-if="!skill.Validation_Date">{{ t('awaitingvalidation') }}</span>
                <span v-else>{{ t('validatedon') }} {{ new Date(skill.Validation_Date).toLocaleDateString('fr-FR') }}</span>

                <!-- Document Link: Display the link even if validation is pending -->
                <a v-if="skill.Document_Path"
                   :href="`http://${axios.defaults.baseURL}:3000/uploads/justificatif/${route.params.id}/${skill.Document_Path}`"
                   :download="skill.Document_Path">
                  {{ t('viewDocument') }}
                </a>

                <!-- Delete Button -->
                <button @click="deleteSkill(skill.Skill_ID)" class="ui red button small">{{ t('delete') }}</button>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>{{ t('noskillsfound') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer_perso {
  margin: 7%;
}

.content-area {
  padding: 20px;
  margin-left: 50px;
  width: calc(70% - 50px);
}

.skills-section {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
}

h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #4a4a4a;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}

.ui.red.button:hover {
  background-color: #c82323;
}

p {
  font-size: 1.2em;
  color: #666;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li span {
  font-weight: bold;
  color: #555;
}

li a {
  color: #4183c4;
  text-decoration: none;
  margin-right: 10px;
}

li a:hover {
  text-decoration: underline;
}
</style>
