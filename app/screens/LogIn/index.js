import * as reduxActions from "@actions";
import { Images } from "@assets";
import { PasswordInput } from "@components";
import React, { Component } from "react";
import { Image as RNImage, View } from "react-native";
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import styles from "./styles";
import { t } from "@utils";

class LogIn extends Component {
  state = {
    email: '',
    password: '',
    validate: {
      email: true,
      password: true,
      show_password: false
    },
    signing: false
  }
  constructor(props) {
    super(props);
  }
  setValidateState(item) {
    this.setState({
      validate: {
        ...this.state.validate,
        ...item
      }
    })
  }
  onVisiblePassword() {
    const { validate: { show_password } } = this.state;
    this.setValidateState({ show_password: !show_password })
  }
  login() {
    const { email, password } = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    this.setValidateState({
      email: reg.test(email),
      password: !!password
    });
    if (!reg.test(email) || !password) {
      return;
    }
    this.setState({ signing: true });
    this.props.login(email, password, res => {
      this.setState({ signing: false });
      if (res.success) {
      } else {
        Toast.showWithGravity(res.message || t("Login failed"), Toast.SHORT, Toast.TOP);
      }
    });
  }
  goSignUp() {
    this.props.navigation.navigate("SignUp");
  }
  render() {
    const { email, password, validate, signing } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.contain}>
          <RNImage source={Images.logo} style={styles.logo} resizeMode={'contain'} />
          <Input
            placeholder={t('Email')}
            value={email}
            errorMessage={validate.email ? '' : t('Please input valid email')}
            onChangeText={email => this.setState({ email })}
          />
          <Input
            placeholder={t('Password')}
            secureTextEntry={!validate.show_password}
            value={password}
            isVisiblePassword={validate.show_password}
            onVisiblePassword={this.onVisiblePassword.bind(this)}
            errorMessage={validate.password ? '' : t('Please input password')}
            InputComponent={PasswordInput}
            onChangeText={password => this.setState({ password })}
          />
          <Button
            title={t("Log In")}
            buttonStyle={styles.actions}
            containerStyle={styles.m_10}
            loading={signing}
            onPress={this.login.bind(this)}
          />
          <Button
            title={t("Create Account")}
            buttonStyle={styles.actions}
            containerStyle={styles.m_10}
            onPress={this.goSignUp.bind(this)}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(LogIn);