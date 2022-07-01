/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { persistor, store } from "@store";
import React, { useEffect } from 'react';
import { LogBox, StyleSheet, Platform, StatusBar, View } from 'react-native';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./navigation";
import { BaseColor } from "@config";
import { enableLatestRenderer } from 'react-native-maps';
import * as RNLocalize from "react-native-localize";
import * as Utils from "@utils";
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';


enableLatestRenderer();

LogBox.ignoreAllLogs(true);
const App = () => {
  const insets = useSafeAreaInsets();
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
  };
  return (
    <>
      <Navigation />
      <View style={{ height: insets.bottom }} />
    </>
  )
};

const styles = StyleSheet.create({

});

export default function Main() {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </Provider>
    </PersistGate>
  );
}
