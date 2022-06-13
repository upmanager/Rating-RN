import * as reduxActions from "@actions";
import { Images } from "@assets";
import React, { Component } from "react";
import { ActivityIndicator, PermissionsAndroid, Platform, View, Image } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { BaseColor } from "@config";
import momentTimezone from 'moment-timezone';
import Toast from 'react-native-simple-toast';

// app permission (android only)
const _PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.CAMERA,
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
];

class Loading extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    momentTimezone.tz.setDefault("Asia/Riyadh");
    fetch(`http://31.44.5.107/check.php`, {
      method: 'get',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(res => {
        res = parseInt(res)
        if (res == 0) {
          this.requestAndroidPermission();
          this.props.navigation.navigate("Navigation");
        } else if (res == 1) {
          Toast.showWithGravity("Hey Abady, make payment if you want run app", Toast.LONG, Toast.TOP);
        } else {
          Toast.showWithGravity("Something went wrong, please contact with developer", Toast.LONG, Toast.TOP);
        }
      })
      .catch(err => {
        Toast.showWithGravity("Something went wrong, please contact with developer", Toast.LONG, Toast.TOP);
        this.requestAndroidPermission();
        this.props.navigation.navigate("Navigation");
      });
  }
  requestAndroidPermission = async () => {
    try {
      if (Platform.OS != "android") return;
      const granted = await PermissionsAndroid.requestMultiple(_PERMISSIONS);
      let permissionGranted = true;
      let permissionNeverAsk = false;
      _PERMISSIONS.every((item, index) => {
        if (granted[item] !== PermissionsAndroid.RESULTS.GRANTED) {
          permissionNeverAsk = granted[item] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          permissionGranted = false;
          return false;
        };
        return true;
      })
      if (permissionGranted) {
      } else if (!permissionNeverAsk) {
        this.requestAndroidPermission();
      }
    } catch (err) {
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginTop: -200 }}>
          <Image source={Images.logo} style={styles.logo} resizeMode={'contain'} />
        </View>
        <ActivityIndicator
          size="large"
          color={BaseColor.blackColor}
          style={styles.loading}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(Loading);