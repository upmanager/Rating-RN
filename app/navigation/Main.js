import * as reduxActions from "@actions";
import { BaseColor } from "@config";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "@screens/Home";
import CustomMapView from "@screens/CustomMapView";
import GiveRating from "@screens/GiveRating";
import Detail from "@screens/Detail";
import React from "react";
import { connect } from "react-redux";
import { t } from "@utils";
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
const TabNavigator = (baseProps) => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: BaseColor.primaryColor,
        tabBarInactiveTintColor: BaseColor.blackColor,
      })}
      drawerContent={(props) => <CustomDrawerContent  {...baseProps} {...props} />}

    >
      <Tab.Screen name="Home" options={{ drawerLabel: t('Home'), title: t('Home') }} component={Home} />
    </Tab.Navigator>
  )
}
const CustomDrawerContent = (props) => {

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={t("Sign Out")}
        onPress={() => {
          props.logoutAction();
        }}
      />
    </DrawerContentScrollView>
  );
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
const TabNavigatorComponent = connect(mapStateToProps, mapDispatchToProps)(TabNavigator);
export default function Navigation() {
  const _NAVIGATIONS = {
    TabNavigator: TabNavigatorComponent,
    Detail,
    CustomMapView,
    GiveRating
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {Object.entries(_NAVIGATIONS).map(([key, value]) => <Stack.Screen name={key} key={key} component={value} options={horizontalAnimation} />)}
    </Stack.Navigator>
  )
}
