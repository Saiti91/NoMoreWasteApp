<script setup>
import {ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import 'fomantic-ui-css/semantic.min.css';
import {useI18n} from 'vue-i18n';

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
        :to="`/users/${route.params.id}`"
        class="item"
        :class="{ active: isRouteActive(`/users/${route.params.id}`) }">
      <i class="user icon"></i>
      {{ t('détailsDeL\'utilisateur') }}
    </router-link>

    <router-link
        :to="`/user-services-proposed/${route.params.id}`"
        class="item"
        :class="{ active: isRouteActive(`/user-services-proposed/${route.params.id}`) }">
      <i class="briefcase icon"></i>
      {{ t('servicesProposés') }}
    </router-link>

    <router-link
        :to="`/user-services-participated/${route.params.id}`"
        class="item"
        :class="{ active: isRouteActive(`/user-services-participated/${route.params.id}`) }">
      <i class="handshake icon"></i>
      {{ t('servicesParticipés') }}
    </router-link>

    <router-link
        :to="`/user-donations/${route.params.id}`"
        class="item"
        :class="{ active: isRouteActive(`/user-donations/${route.params.id}`) }">
      <i class="gift icon"></i>
      {{ t('donationsFaites') }}
    </router-link>

    <router-link
        :to="`/user-products-received/${route.params.id}`"
        class="item"
        :class="{ active: isRouteActive(`/user-products-received/${route.params.id}`) }">
      <i class="box icon"></i>
      {{ t('produitsReçus') }}
    </router-link>

    <router-link
        :to="`/user-routes/${route.params.id}`"
        class="item"
        :class="{ active: isRouteActive(`/user-routes/${route.params.id}`) }">
      <i class="box icon"></i>
      {{ t('tournee') }}
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
  margin-left: -15px;
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
