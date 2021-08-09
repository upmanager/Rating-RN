import { Dimensions } from "react-native";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';
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