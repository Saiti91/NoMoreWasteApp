<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import 'fomantic-ui-css/semantic.min.css';
import { useI18n } from 'vue-i18n';

const t = useI18n().t;
const router = useRouter();
const route = useRoute();
const activeRoute = ref(route.path);

router.afterEach((to) => {
  activeRoute.value = to.path;
});

const isRouteActive = (route) => activeRoute.value === route;
</script>

<template>
  <div class="ui vertical menu account-menu">
    <router-link
        :to="`/advice`"
        class="item"
        :class="{ active: isRouteActive(`/advice`) }">
      <i class="lightbulb icon"></i>
      {{ t('antiWasteTip')}}
    </router-link>

    <router-link
        :to="`/cooking`"
        class="item"
        :class="{ active: isRouteActive(`/cooking`) }">
      <i class="utensils icon"></i>
      {{ t('cookingLesson') }}
    </router-link>

    <router-link
        :to="`/security`"
        class="item"
        :class="{ active: isRouteActive(`/security`) }">
      <i class="shield alternate icon"></i>
      {{ t('security') }}
    </router-link>

    <router-link
        :to="`/car`"
        class="item"
        :class="{ active: isRouteActive(`/car`) }">
      <i class="car icon"></i>
      {{ t('carSharing') }}
    </router-link>

    <router-link
        :to="`/help`"
        class="item"
        :class="{ active: isRouteActive(`/help`) }">
      <i class="hands helping icon"></i>
      {{ t('entraide') }}
    </router-link>
  </div>
</template>

<style scoped>
.account-menu {
  width: 30%;
  max-width: 300px;
  padding: 20px;
  background-color: #f4f4f4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
  position: fixed; /* Positionner le menu de manière fixe à gauche */
  top: 7%;
  left: 0;
}

.ui.vertical.menu .item.active {
  background-color: #e0e0e0;
  font-weight: bold;
}

.ui.vertical.menu .item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin: 10px 0;
  font-size: 1.2em;
}

.ui.vertical.menu .item i.icon {
  margin-right: 15px;
  font-size: 1.5em;
}
</style>
