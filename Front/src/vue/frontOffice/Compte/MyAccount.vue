<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/Axios.js';
import { useRoute, useRouter } from 'vue-router';
import Header from "@/components/HeaderFrontOffice.vue";
import UserMenuFO from "@/components/UserDetailsLeftMenuFO.vue";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n';

const user = ref(null);
const originalUser = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showCurrentPassword = ref(false);
const showConfirmPassword = ref(false);
const skills = ref([]);
const userSkills = ref([]);
const selectedSkill = ref(null);
const documentFile = ref(null);
const t = useI18n().t;
const route = useRoute();
const router = useRouter();

// Formater la date de naissance pour l'input
const formatDateForInput = (date) => {
  if (!date) return '';
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Récupère infos de l'utilisateur
const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`/users/${route.params.id}`);
    user.value = response.data;
    originalUser.value = { ...response.data };
    user.value.Birthdate = formatDateForInput(user.value.Birthdate);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

// Récupérer toutes les compétences et celles de l'utilisateur
const fetchSkills = async () => {
  try {
    // Récupérer toutes les compétences disponibles
    const skillsResponse = await axios.get('/skills');
    skills.value = skillsResponse.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
  }

  try {
    // Récupérer les compétences de l'utilisateur
    const userSkillsResponse = await axios.get(`/skills/user/${route.params.id}`);
    userSkills.value = userSkillsResponse.data;
    console.log("Les skills de l'utilisateur: ", userSkills.value);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn('No skills found for user:', route.params.id);
      userSkills.value = [];
    } else {
      console.error('Error fetching user skills:', error);
    }
  }
};


// Valider les champs avant enregistrement
const validateFields = () => {
  for (const key in originalUser.value) {
    if (originalUser.value[key] && !user.value[key]) {
      Swal.fire({
        icon: 'error',
        title: t('errorUpdateUserTitle'),
        text: t('errorUpdateUserLeftFields'),
      });
      return false;
    }
  }

  if (newPassword.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: t('errorUpdateUserTitle'),
      text: t('pwd-dont-match'),
    });
    return false;
  }

  return true;
};

// Mettre à jour les infos utilisateur
const updateUserDetails = async () => {
  if (!validateFields()) return;

  const updateData = {
    first_name: user.value.Firstname,
    last_name: user.value.Name,
    email: user.value.Email,
    telephone: user.value.Phone,
    birthdate: user.value.Birthdate,
    address: {
      street: user.value.Street,
      city: user.value.City,
      state: user.value.State,
      postal_code: user.value.Postal_Code,
      country: user.value.Country,
    },
  };

  if (newPassword.value) {
    updateData.password = newPassword.value;
  }

  try {
    await axios.patch(`/users/${route.params.id}`, updateData);
    Swal.fire({
      icon: 'success',
      title: t('successUpdateUserTitle'),
      text: t('successUpdateUserTxt'),
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    Swal.fire({
      icon: 'error',
      title: t('errorUpdateUserTitle'),
      text: t('errorUpdateUserTxt'),
    });
  }
};

// Supprimer son compte
const deleteUser = async () => {
  Swal.fire({
    title: t('popupDelUserFO'),
    text: t('popupDelUserTxt'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('yesDel'),
    cancelButtonText: t('cancel'),
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
          title: t('error_title'),
          text: t('errorDelTxt'),
        });
      }
    }
  });
};

const validateSuppression = () => {
  Swal.fire({
    icon: 'success',
    title: t('deleted'),
    text: t('successDelUserTxt'),
  });
};

// Ajouter une nouvelle compétence
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
  console.log(formData);
  try {
    await axios.post(`/skills/${route.params.id}/skills`, formData);
    await fetchSkills();
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

// Supprimer une compétence
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
        validateSkillSuppression();
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

const validateSkillSuppression = () => {
  Swal.fire({
    icon: 'success',
    title: t('deleted'),
    text: t('successDeleteSkillTxt'),
  });
};


onMounted(() => {
  fetchUserDetails();
  fetchSkills();
});
</script>



<template>
  <Header />
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <UserMenuFO />
      <div class="content-area">
        <!-- Partie info utilisateur -->
        <div class="header-section">
          <h2>{{ t('userDetails') }}</h2>
          <button @click="deleteUser" class="ui red button">{{ t('delete') }}</button>
        </div>
        <div v-if="user" class="user-details">
          <p><strong>{{ t('last-name') }} :</strong>
            <input v-model="user.Name" type="text" class="ui input styled-input" required />
          </p>
          <p><strong>{{ t('first-name') }} :</strong>
            <input v-model="user.Firstname" type="text" class="ui input styled-input" required />
          </p>
          <p><strong>{{ t('email') }} :</strong>
            <input v-model="user.Email" type="email" class="ui input styled-input" required />
          </p>
          <p><strong>{{ t('phone') }} :</strong>
            <input v-model="user.Phone" type="tel" class="ui input styled-input" />
          </p>
          <p><strong>{{ t('birthdate') }} :</strong>
            <input v-model="user.Birthdate" type="date" class="ui input styled-input" />
          </p>
          <p><strong>{{ t('subscriptionStatus') }} :</strong>
            <span v-if="user.Current_Subscription" class="status-active">{{ t('subscriber') }}</span>
            <span v-else class="status-inactive">{{ t('nonSubscriber') }}</span>
          </p>
          <h3>{{ t('address') }}</h3>
          <p><strong>{{ t('street') }} :</strong>
            <input v-model="user.Street" type="text" class="ui input styled-input" />
          </p>
          <p><strong>{{ t('city') }} :</strong>
            <input v-model="user.City" type="text" class="ui input styled-input" />
          </p>
          <p><strong>{{ t('state') }} :</strong>
            <input v-model="user.State" type="text" class="ui input styled-input" />
          </p>
          <p><strong>{{ t('postalCode') }} :</strong>
            <input v-model="user.Postal_Code" type="text" class="ui input styled-input" />
          </p>
          <p><strong>{{ t('country') }}:</strong>
            <input v-model="user.Country" type="text" class="ui input styled-input" />
          </p>

          <!-- Champs mot de passe -->
          <h3>{{ t('changePassword') }}</h3>
          <p><strong>{{ t('currentPassword') }} :</strong>
            <span>{{ showCurrentPassword ? user.Password : '********' }}</span>
            <i :class="showCurrentPassword ? 'eye slash icon' : 'eye icon'"
               @click="showCurrentPassword = !showCurrentPassword"></i>
          </p>
          <div class="password-section">
            <p>
              <strong>{{ t('newPassword') }} :</strong>
              <input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" class="ui input styled-input password-input" />
              <i :class="showNewPassword ? 'eye slash icon' : 'eye icon'"
                 @click="showNewPassword = !showNewPassword"></i>
            </p>
            <p>
              <strong>{{ t('confirmPassword') }} :</strong>
              <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="ui input styled-input password-input" />
              <i :class="showConfirmPassword ? 'eye slash icon' : 'eye icon'"
                 @click="showConfirmPassword = !showConfirmPassword"></i>
            </p>
          </div>
          <button @click="updateUserDetails" class="ui teal button">{{ t('saveChanges') }}</button>
        </div>
          <!-- Section des compétences -->
          <div class="skills-section">
            <h3>{{ t('skills') }}</h3>
            <div v-if="userSkills.length">
              <h4>{{ t('validatedSkills') }}</h4>
              <ul>
                <li v-for="skill in userSkills" :key="skill.Skill_ID">
                  {{ skill.Name }} -
                  <a v-if="skill.Document_Path"
                     :href="`http://10.0.2.2:3000/uploads/justificatif/${route.params.id}/${skill.Document_Path}`"
                     :download="skill.Document_Path">
                    {{ t('viewDocument') }}
                  </a>
                  <button @click="deleteSkill(skill.Skill_ID)" class="ui red button small">{{ t('delete') }}</button>
                </li>
              </ul>
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
                <input type="file" @change="e => documentFile.value = e.target.files[0]" />
              </div>
              <button @click="addSkill" class="ui teal button">{{ t('addSkillButton') }}</button>
            </div>
          </div>

          <router-view />
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

.styled-input {
  border: 1px solid #ddd;
  padding: 8px 10px;
  border-radius: 4px;
  width: calc(100% - 160px);
  margin-left: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.styled-input:focus {
  border-color: #00b5ad;
  outline: none;
}

.status-active {
  color: green;
  font-weight: bold;
}

.status-inactive {
  color: red;
  font-weight: bold;
}

.password-section p {
  display: flex;
  align-items: center;
}

.password-input {
  width: auto;
  flex-grow: 1;
  margin-left: 10px;
}

.eye.icon,
.eye.slash.icon {
  cursor: pointer;
  margin-left: 10px;
}

.ui.red.button {
  background-color: #db2828;
  color: white;
}

.ui.teal.button {
  background-color: #00b5ad;
  color: white;
}

.skills-section {
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #eef4f7;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.skills-section h3,
.skills-section h4 {
  color: #333;
}

.skills-section ul {
  list-style-type: none;
  padding: 0;
}

.skills-section ul li {
  margin: 10px 0;
}

.ui.form {
  margin-top: 20px;
}

.ui.dropdown {
  width: 100%;
}

.ui.form .field {
  margin-bottom: 15px;
}
</style>
