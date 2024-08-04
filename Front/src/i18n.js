// src/i18n.js
import { createI18n } from 'vue-i18n';
import En from './langues/en.json';
import Fr from './langues/fr.json';

const messages = {
    En: En,
    Fr: Fr,
};

const i18n = createI18n({
    legacy: false,
    locale: 'Fr', // Langue par défaut
    fallbackLocale: 'Fr',
    messages,
});

export default i18n;
