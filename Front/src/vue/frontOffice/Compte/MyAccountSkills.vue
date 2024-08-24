<script setup>
import {onMounted, ref} from 'vue';
import axios from '@/utils/Axios.js';
import {useRoute} from 'vue-router';
import Header from "@/components/HeaderFrontOffice.vue";
import UserMenuFO from "@/components/UserDetailsLeftMenuFO.vue";
import Swal from "sweetalert2";
import {useI18n} from 'vue-i18n';

const t = useI18n().t;
const route = useRoute();
const skills = ref([]);
const userSkills = ref([]);
const selectedSkill = ref(null);
const documentFile = ref(null);

// Fetch all skills and user-specific skills
const fetchSkills = async () => {
  try {
    const skillsResponse = await axios.get('/skills');
    skills.value = skillsResponse.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
  }

  try {
    const userSkillsResponse = await axios.get(`/skills/user/${route.params.id}`);
    userSkills.value = userSkillsResponse.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn('No skills found for user:', route.params.id);
      userSkills.value = [];
    } else {
      console.error('Error fetching user skills:', error);
    }
  }
};

// Add a new skill
const addSkill = async () => {
  if (!selectedSkill.value) {
    Swal.fire({
      icon: 'error',
      title: t('errorAddSkillTitle'),
      text: t('errorAddSkillTxt'),
    });
    return;
  }

  const formData = new FormData();
  formData.append('skill_id', selectedSkill.value);
  if (documentFile.value) {
    formData.append('document', documentFile.value);
  }

  try {
    await axios.post(`/skills/${route.params.id}/skills`, formData);
    await fetchSkills();

    // Show success message
    Swal.fire({
      icon: 'success',
      title: t('orderSuccess'),
      text: t('orderSuccessMsg'),
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    Swal.fire({
      icon: 'error',
      title: t('orderError'),
      text: t('orderErrorMessage'),
    });
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
        await fetchSkills();
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

// File input change handler
const onDocumentFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    documentFile.value = file;
  }
};

onMounted(() => {
  fetchSkills();
});
</script>

<template>
  <Header/>
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenuFO/>
      <div class="content-area">
        <h2>{{ t('skillsmanagement') }}</h2>
        <div class="skills-section">
          <div v-if="userSkills.length > 0">
            <h4>{{ t('validatedSkills') }}</h4>
            <ul>
              <li v-for="skill in userSkills" :key="skill.Skill_ID">
                {{ skill.Name }} -
                <a v-if="skill.Document_Path"
                   :href="`http://${axios.defaults.baseURL}:3000/uploads/justificatif/${route.params.id}/${skill.Document_Path}`"
                   :download="skill.Document_Path">
                  {{ t('viewDocument') }}
                </a>
                <button @click="deleteSkill(skill.Skill_ID)" class="ui red button small">{{ t('delete') }}</button>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>{{ t('noskillsfound') }}</p>
          </div>

          <h4>{{ t('addSkill') }}</h4>
          <div class="ui form">
            <div class="field">
              <label>{{ t('selectSkill') }}</label>
              <select v-model="selectedSkill" class="ui dropdown">
                <option v-for="skill in skills" :key="skill.Skill_ID" :value="skill.Skill_ID">{{ skill.Name }}</option>
              </select>
            </div>
            <div class="field">
              <label>{{ t('uploadDocument') }}</label>
              <input type="file" @change="onDocumentFileChange"/>
            </div>
            <button @click="addSkill" class="ui teal button">{{ t('addSkillButton') }}</button>
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

.ui.form .field {
  margin-bottom: 15px;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}

.ui.teal.button {
  background-color: #00b5ad;
  color: white;
}

p {
  font-size: 1.2em;
  color: #666;
}
</style>
