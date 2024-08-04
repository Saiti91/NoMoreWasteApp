<!-- src/components/HeaderBackOffice.vue -->
<template>
  <HeaderComponent logo="path/to/backoffice-logo.png">
    <template #nav>
      <div class="ui secondary menu">
        <a class="item" href="#stocks">Stocks</a>
        <a class="item" href="#users">Utilisateurs</a>
        <a class="item" href="#don-requests">Demandes de dons</a>
        <a class="item" href="#tours">Tournées</a>
        <a class="item" href="#service-requests">Demandes de services</a>
      </div>
    </template>
    <template #actions>
      <div class="ui buttons">
        <button class="ui button">Logout</button>
      </div>
    </template>
  </HeaderComponent>
</template>

<script>
import HeaderComponent from './HeaderComponent.vue'

export default {
  name: 'HeaderBackOffice',
  components: {
    HeaderComponent
  }
}
</script>

<style scoped>
/* Ajoutez ici des styles supplémentaires si nécessaire */
</style>
