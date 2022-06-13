import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SignUp from "@screens/SignUp";
import LogIn from "@screens/LogIn";

const Stack = createStackNavigator();
export default AuthNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="LogIn"
      screenOptions={{
        animationEnabled: false,
        headerShown: false
      }}
    >
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}