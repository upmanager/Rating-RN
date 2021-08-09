import { BaseColor } from "@config";
import auth from '@react-native-firebase/auth';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChooseBranch from "@screens/ChooseBranch";
import Rating from "@screens/Rating";
import UserViolation from "@screens/UserViolation";
import React from "react";
import { connect } from "react-redux";
const Tab = createDrawerNavigator();
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
        tabBarActiveTintColor: BaseColor.primaryColor,
        tabBarInactiveTintColor: BaseColor.blackColor,
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}

    >
      <Tab.Screen name="Branch" component={ChooseBranch} />
      <Tab.Screen name="Rating" component={Rating} />
      <Tab.Screen name="Violation" component={UserViolation} />
    </Tab.Navigator>
  )
}
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={logout}
      />
    </DrawerContentScrollView>
  );
}

const mapStateToProps = (state) => (state)
const TabNavigatorComponent = connect(mapStateToProps, null)(TabNavigator);
const logout = () => {
  auth().signOut();
}
export default function Navigation() {
  const _NAVIGATIONS = {
    TabNavigator: TabNavigatorComponent,
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {Object.entries(_NAVIGATIONS).map(([key, value]) => <Stack.Screen name={key} key={key} component={value} options={horizontalAnimation} />)}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
