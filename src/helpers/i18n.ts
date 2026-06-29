import { NativeModules } from 'react-native';
import { translations, type TranslationKeys } from '../constants/translations';
import { storage } from '../storage';
import { isIOS, isAndroid } from './utils';

const getDeviceLanguage = (): 'en' | 'uk' => {
  try {
    // 1. Check if user has a saved language in MMKV first
    const savedLang = storage.getString('user_language');
    if (savedLang === 'en' || savedLang === 'uk') {
      return savedLang;
    }

    // 2. If not, auto-detect from device settings
    let locale = '';

    if (isIOS) {
      const settings = NativeModules.SettingsManager?.settings;
      const appleLanguages = settings?.AppleLanguages;
      if (Array.isArray(appleLanguages) && appleLanguages.length > 0) {
        locale = appleLanguages[0];
      } else {
        locale = settings?.AppleLocale || '';
      }
    } else if (isAndroid) {
      locale = NativeModules.I18nManager?.localeIdentifier || '';
    }

    if (!locale) {
      locale = Intl.DateTimeFormat().resolvedOptions().locale;
    }

    locale = locale.toLowerCase();
    
    if (
      locale.startsWith('uk') ||
      locale.startsWith('ua') ||
      locale.includes('uk-') ||
      locale.includes('ua-') ||
      locale.includes('uk_') ||
      locale.includes('ua_')
    ) {
      return 'uk';
    }
  } catch (e) {
    console.error('[i18n] Failed to resolve locale:', e);
  }
  return 'en';
};

// Export t as a typed Proxy for dynamic language resolution during rendering
export const t: TranslationKeys = new Proxy({} as any, {
  get(_, prop) {
    const lang = getDeviceLanguage();
    return translations[lang][prop as keyof TranslationKeys];
  },
});

// Function to manually change language
export const changeLanguage = (lang: 'en' | 'uk') => {
  try {
    storage.set('user_language', lang);
  } catch (e) {
    console.error('[i18n] Failed to change language:', e);
  }
};

// Get current active language
export const getCurrentLanguage = (): 'en' | 'uk' => {
  return getDeviceLanguage();
};




