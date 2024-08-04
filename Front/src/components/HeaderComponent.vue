<!-- src/components/HeaderComponent.vue -->
<template>
  <header class="header">
    <div class="logo" v-if="logo">
      <img :src="logo" alt="Logo" />
    </div>
    <nav class="navigation">
      <slot name="nav"></slot>
    </nav>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  props: {
    logo: {
      type: String,
      required: false
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
}
.logo img {
  max-height: 50px;
}
.navigation {
  flex-grow: 1;
  text-align: center;
}
.actions {
  display: flex;
  gap: 1rem;
}
</style>
