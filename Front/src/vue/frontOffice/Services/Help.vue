<script setup>

import ServiceMenu from "@/components/ServiceLeftMenu.vue";
import Header from "@/components/HeaderFrontOffice.vue";
</script>

<template>
  <Header/>
  <div class="spacer_perso"></div>
  <div class="ui container full-width no-center">
    <div class="ui grid">
      <ServiceMenu/>
      <div class="content-area">
        <p>Entraide</p>
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
  margin-left: 7%;
  width: calc(70% - 50px);
}



</style>