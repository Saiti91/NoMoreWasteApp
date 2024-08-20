import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from "@/i18n";
import 'fomantic-ui-css/semantic.min.css'
import router from "@/routers/Router.js";
import store from "./store.js";

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(store);

app.mount('#app');
