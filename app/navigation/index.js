import React from 'react';
import Loading from "@screens/Loading";
import Auth from "./Auth";
import Main from "./Main";
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const Navigation = (props) => {
  const { auth } = props;
  if (auth?.user?.token) {
    return <Main />
  }
  return <Auth />
}

const mapStateToProps = (state) => (state)
const MainNavigator = connect(mapStateToProps, null)(Navigation)

export default (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Navigation" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}