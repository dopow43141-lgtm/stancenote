import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

import ja from './ja';
import en from './en';

const i18n = new I18n({ ja, en });

i18n.defaultLocale = 'ja';
i18n.enableFallback = true;

const deviceLang = getLocales()[0]?.languageCode ?? 'ja';
i18n.locale = deviceLang === 'ja' ? 'ja' : 'en';

export function t(scope: string, options?: Record<string, unknown>): string {
  return i18n.t(scope, options);
}

export default i18n;
