import { getDeviceWidth } from "@utils";
import { BaseColor } from "@config";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BaseColor.whiteColor
  },
  logo: {
    width: "80%",
    height: 200,
  },
  loading: {
    position: "absolute",
    top: 160,
    bottom: 0,
  }
});
