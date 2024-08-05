<script setup>
import { useRouter } from 'vue-router';
import { toRefs } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const { user } = toRefs(props);
const router = useRouter();

const goToDetails = () => {
  router.push({ name: 'user-details', params: { userId: user.value.User_ID } });
};
</script>

<template>
  <div class="ui card full-width-card" @click="goToDetails">
    <div class="content">
      <div class="header">{{ user.Name }} {{user.Firstname}}</div>
      <div class="meta">
        <span class="date">{{ user.Email }}</span>
      </div>
      <div class="description">
        {{ user.Phone }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.full-width-card {
  width: 100%;
  margin: 10px 0;
}
.ui.card {
  cursor: pointer;
}
</style>
