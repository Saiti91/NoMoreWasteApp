<script setup>
import Header from "@/components/HeaderFrontOffice.vue";
import {useI18n} from 'vue-i18n';
//const { t } = useI18n();
</script>

<template>
  <Header/>
  <div class="spacer"></div>
  <div class="ui container">
    <section class="ui segment vertical">
      <h1 class="ui teal header center aligned">{{ $t('assos_name') }}</h1>
      <p class="ui text container">{{ $t('home_txt_1') }}</p>
    </section>

    <section class="ui segment vertical">
      <h2 class="ui teal header center aligned">{{ $t('our_services') }}</h2>
      <div class="ui three column stackable grid">
        <div class="column">
          <div class="ui icon header">
            <i class="car icon"></i>{{ $t('home_title_car') }}
          </div>
          <p>{{ $t('home_txt_car') }}</p>
        </div>
        <div class="column">
          <div class="ui icon header">
            <i class="tools icon"></i>{{ $t('home_title_project') }}
          </div>
          <p>{{ $t('home_txt_project') }}</p>
        </div>
        <div class="column">
          <div class="ui icon header">
            <i class="utensils icon"></i>{{ $t('home_title_cooking') }}
          </div>
          <p>{{ $t('home_txt_cooking') }}</p>
        </div>
      </div>
    </section>

    <section class="ui segment vertical">
      <h2 class="ui teal header center aligned">{{ $t('join_us') }}</h2>
      <div class="ui two column stackable grid">
        <div class="column">
          <div class="ui icon header">
            <i class="heart icon"></i>{{ $t('home_title_volunteer') }}
          </div>
          <p>{{ $t('home_txt_volunteer') }}</p>
        </div>
        <div class="column">
          <div class="ui icon header">
            <i class="donate icon"></i>{{ $t('home_title_donation') }}
          </div>
          <p>{{ $t('home_txt_donation') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ui.container {
  padding: 20px;
}

.ui.segment.vertical {
  padding: 40px 0;
}

.ui.header.center.aligned {
  text-align: center;
}

.ui.icon.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ui.icon.header .icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: teal;
}

.ui.text.container {
  text-align: center;
}
</style>
