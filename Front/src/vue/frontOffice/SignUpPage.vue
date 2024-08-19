<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import axios from '@/utils/Axios.js';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const last_name = ref('');
const first_name = ref('');
const street = ref('');
const city = ref('');
const state = ref('');
const postal_code = ref('');
const country = ref('');

const message = ref(false);
const error = ref(null);
const success = ref(null);

const router = useRouter();
const {t} = useI18n();

const submitForm = async () => {
  error.value = null;
  success.value = null;

  if (password.value !== confirmPassword.value) {
    error.value = t('pwdDontMatch');
    return;
  }

  try {
    const payload = {
      email: email.value,
      password: password.value,
      firstname: first_name.value,
      name: last_name.value,
      address: {
        street: street.value,
        city: city.value,
        state: state.value,
        postal_code: postal_code.value,
        country: country.value,
      },
    };

    console.log("payload", payload);

    const response = await axios.post('auth/register/', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 201) {
      success.value = t('accountCreatedSuccessfully');
      router.push('/login');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 400) {
        error.value = t('emailalreadyused');
      } else if (err.response.status === 401) {
        error.value = t('unauthorizedAccess');
      } else {
        error.value = err.response.data?.message || t('something_went_wrong');
      }
    } else {
      error.value = t('networkError');
    }
    console.log("Error:", err);
  }
}
</script>

<template>
  <div class="ui middle aligned center aligned grid" style="height: 100vh;">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header">
        {{ t('account_creation') }}
      </h2>
      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-if="success" class="ui positive message">{{ success }}</div>
      <form class="ui large form" @submit.prevent="submitForm">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" v-model="first_name" name="first_name" :placeholder="t('first-name')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" v-model="last_name" name="last_name" :placeholder="t('last-name')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="mail icon"></i>
              <input type="email" v-model="email" name="email" :placeholder="t('email')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="password" name="password" :placeholder="t('password')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="confirmPassword" name="confirmPassword"
                     :placeholder="t('confirm_password')" required>
            </div>
          </div>
          <!-- Partie Adresse -->
          <div class="field">
            <div class="ui left icon input">
              <i class="home icon"></i>
              <input type="text" v-model="street" name="street" :placeholder="t('street')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="building icon"></i>
              <input type="text" v-model="city" name="city" :placeholder="t('city')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="map marker alternate icon"></i>
              <input type="text" v-model="state" name="state" :placeholder="t('state')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="envelope icon"></i>
              <input type="text" v-model="postal_code" name="postal_code" :placeholder="t('postalCode')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="globe icon"></i>
              <input type="text" v-model="country" name="country" :placeholder="t('country')" required>
            </div>
          </div>
          <button class="ui fluid large teal submit button" type="submit">{{ t('sign_up') }}</button>
        </div>
      </form>
      <div class="ui message">{{ t('older_to_us') }}
        <router-link to="/login" class="item">{{ t('account_Login') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
