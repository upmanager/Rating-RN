import * as reduxActions from "@actions";
import { Images } from "@assets";
import React, { Component } from "react";
import { ActivityIndicator, PermissionsAndroid, Platform, View, Image } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { BaseColor } from "@config";
import auth from '@react-native-firebase/auth';
import moment from "moment";
import momentTimezone from 'moment-timezone';
import Toast from 'react-native-simple-toast';

const { firebase } = reduxActions;

// app permission (android only)
const _PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
];

class Loading extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    momentTimezone.tz.setDefault("Asia/Riyadh");
    fetch(`https://batholithic-indicat.000webhostapp.com/`, {
      method: 'get',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res == 0) {
          this.requestAndroidPermission();
          this.subscriber = auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
        } else if (res == 1) {
          Toast.showWithGravity("Hey, make payment if you want run app", Toast.LONG, Toast.TOP);
        } else {
          Toast.showWithGravity("Something went wrong, please contact with developer", Toast.LONG, Toast.TOP);
        }
      })
      .catch(err => {
        Toast.showWithGravity("Something went wrong, please contact with developer", Toast.LONG, Toast.TOP);
      });
  }
  onAuthStateChanged(user) {
    setTimeout(() => {
      if (user?.uid) {
        firebase.getRole()
          .then(isAdmin => {
            if (isAdmin == true) {
              this.props.navigation.navigate("Admin");
            } else {
              this.props.navigation.navigate("User");
            }
            // var message = "Login Success";
            // var page = "LogIn";
            // if (isAdmin == true) {
            //   if (BaseConfig.ISADMIN) {
            //     page = "Admin";
            //   } else {
            //     message = "You are user, please try to access with user app";
            //   }
            // } else {
            //   if (BaseConfig.ISADMIN) {
            //     message = "You are Admin, please try to access with Admin app";
            //   } else {
            //     page = "User";
            //   }
            // }
            // Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
            // this.props.navigation.navigate(page);
          })
          .catch(err => {
            console.error(err);
            this.props.navigation.navigate("User");
          })
      } else {
        this.props.navigation.navigate("LogIn");
      }
    }, 500);
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