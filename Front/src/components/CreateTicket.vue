<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="ui form">
    <div class="two fields">
      <div class="field error">
        <label>First Name</label>
        <input placeholder="First Name" type="text">
      </div>
      <div class="field">
        <label>Last Name</label>
        <input placeholder="Last Name" type="text">
      </div>
    </div>
    <div class="field error">
      <label>Gender</label>
      <div class="ui selection dropdown">
        <div class="default text">Select</div>
        <i class="dropdown icon"></i>
        <input type="hidden" name="gender">
        <div class="menu">
          <div class="item" data-value="male">Male</div>
          <div class="item" data-value="female">Female</div>
        </div>
      </div>
    </div>
    <div class="inline field error">
      <div class="ui checkbox">
        <input type="checkbox" tabindex="0" class="hidden">
        <label>I agree to the Terms and Conditions</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
