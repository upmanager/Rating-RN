/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { persistor, store } from "@store";
import React, { useEffect } from 'react';
import { LogBox, StyleSheet, Platform, StatusBar } from 'react-native';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./navigation";
import { BaseColor } from "@config";
import { enableLatestRenderer } from 'react-native-maps';
import * as RNLocalize from "react-native-localize";
import * as Utils from "@utils";

enableLatestRenderer();

LogBox.ignoreAllLogs(true);
const App = () => {
  useEffect(() => {
    Utils.setI18nConfig();

    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor(BaseColor.primaryColor)
    }
    const localize = RNLocalize.addEventListener("change", handleLocalizationChange);

    return localize

  }, []);
  const handleLocalizationChange = () => {
    Utils.setI18nConfig();
    this.forceUpdate();
  };
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  )
};

const styles = StyleSheet.create({

});

export default App;
