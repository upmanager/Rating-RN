import { Text } from "@components";
import { BaseColor } from "@config";
import auth from '@react-native-firebase/auth';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Branch from "@screens/Branch";
import Option from "@screens/Option";
import RatingView from "@screens/RatingView";
import Violation from "@screens/Violation";
import PreviewImage from "@screens/PreviewImage";
import React from "react";
import { TouchableOpacity, View } from 'react-native';
import { connect } from "react-redux";
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
const TabNavigator = (props) => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: BaseColor.whiteColor,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100 },
        tabBarStyle: { backgroundColor: BaseColor.primaryColor },
      })}
    >
      <Tab.Screen name="BRANCH" component={Branch} />
      <Tab.Screen name="OPTION" component={Option} />
      <Tab.Screen name="RATINGVIEW" component={RatingView} />
      <Tab.Screen name="VIOLATION" component={Violation} />
    </Tab.Navigator>
  )
}
const mapStateToProps = (state) => (state)
const TabNavigatorComponent = connect(mapStateToProps, null)(TabNavigator);
const logout = () => {
  auth().signOut();
}
export default function Navigation() {
  const _NAVIGATIONS = {
    TabNavigator: TabNavigatorComponent,
    PreviewImage: PreviewImage
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: BaseColor.primaryColor,
            height: 35,
          },
          headerTitle: "",
          headerRight: props => (
            <View style={{ alignItems: "flex-end", paddingRight: 10 }}>
              <TouchableOpacity onPress={logout}>
                <Text whiteColor>SIGN OUT</Text>
              </TouchableOpacity>
            </View>)
        }}>
        {Object.entries(_NAVIGATIONS).map(([key, value]) => <Stack.Screen name={key} key={key} component={value} options={{ ...horizontalAnimation, ...(key != "TabNavigator" && { headerShown: false }) }} />)}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
