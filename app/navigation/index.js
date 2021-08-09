import Loading from "@screens/Loading";
import LogIn from "@screens/LogIn";
import SignUp from "@screens/SignUp";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import Admin from "./Admin";
import User from "./User";

const AppNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    LogIn: LogIn,
    SignUp: SignUp,
    Admin: Admin,
    User: User,
  },
  {
    initialRouteName: "Loading"
  }
);

export default createAppContainer(AppNavigator);
