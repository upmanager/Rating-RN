import { Dimensions, I18nManager } from "react-native";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';
import i18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import memoize from "lodash.memoize";

const translationGetters = {
  en: () => require("../lang/en.json"),
  ar: () => require("../lang/ar.json")
};

const checkKeyTrans = (key) => {
  const cur_lan = getCurLan() == "en" ? translationGetters.en() : translationGetters.ar();
  if (key in cur_lan) return key;
  else if (key.replace(" ", "-") in cur_lan) return key;
  else if (key.toLowerCase() in cur_lan) return key;
  else if (key.replace(" ", "-").toLowerCase() in cur_lan) return key;
  return false;
}
export const t = (text, ...params) => {
  if (typeof text == "string") {
    const key = checkKeyTrans(text.replace("...", ''));
    if (key) {
      text = textTranslate(key)
    }
  }
  try {
    params?.forEach((item, index) => {
      text = text.replace(`%${index + 1}`, item);
    });
  } catch (error) {
  }
  return text;
}
export const textTranslate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

export const setI18nConfig = () => {
  const fallback = { languageTag: "en", isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

  textTranslate.cache.clear();
  I18nManager.forceRTL(isRTL);
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};
export const getCurLan = () => { return i18n.locale };

export const getDeviceWidth = (windows) => {
  return Dimensions.get(windows ? 'window' : 'screen').width;
}
export const getDeviceHeight = (windows) => {
  return Dimensions.get(windows ? 'window' : 'screen').height;
}
export const createPDF = async (data, type) => { //type: branch
  var html = '<table>';
  if (type == "branch" || type == "options") {
    data.forEach(element => {
      html += `<tr><td>${element.name}</td></tr>`
    });
  } else if (type == "ratings") {

    data.forEach(element => {
      html += `<tr><td>${element.option}</td><td>${element.Rate}</td></tr>`
    });
  }
  html += '</table>';

  const fileName = `${type}_${moment().format('YYYYMMDD_hhmmss')}`;
  let options = {
    html,
    fileName,
    directory: 'Documents',
  };
  let file = await RNHTMLtoPDF.convert(options);
  return file.filePath;
}
