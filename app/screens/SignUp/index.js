import * as reduxActions from "@actions";
import { Header, PasswordInput, Text } from "@components";
import { BaseColor, BaseConfig } from "@config";
import React, { Component } from "react";
import { View } from "react-native";
import { Button, Icon, Input, Switch } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import styles from "./styles";

class LogIn extends Component {
  state = {
    username: "",
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    validate: {
      username: true,
      email: true,
      password: true,
      confirm_password: true,
      show_password: false,
      show_confirm_password: false,
    },
    registering: false
  }
  curIndex = 0;
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
  onBack() {
    this.props.navigation.navigate("LogIn");
  }
  register() {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    const { email, password, confirmPassword, username, isAdmin } = this.state;
    this.setValidateState({
      email: reg.test(email),
      password: !!password,
      confirm_password: password == confirmPassword,
      username: !!username,
    })
    if (!reg.test(email) || !password || password != confirmPassword, !username) {
      return;
    }
    this.setState({ registering: true });
    // const isadmin = BaseConfig.ISADMIN;
    this.props.register(email, password, username, isAdmin, res => {
      this.setState({ registering: false });
      if (res.success) {
        Toast.showWithGravity(res.message, Toast.SHORT, Toast.TOP);
      } else {
        Toast.showWithGravity(res.message || 'Register failed, please try again later.', Toast.SHORT, Toast.TOP);
      }
    })
  }
  render() {
    const { username, email, password, confirmPassword, validate, registering, isAdmin } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title={'Create account'}
          renderLeft={<Icon name={'angle-left'} color={BaseColor.whiteColor} size={30} type={'font-awesome'} />}
          onPressLeft={this.onBack.bind(this)}
          loading={registering}
        />
        <View style={styles.contain}>
          <Input
            placeholder='User Name'
            value={username}
            errorMessage={validate.username ? '' : 'Please input User Name'}
            onChangeText={username => this.setState({ username })}
          />
          <Input
            placeholder='Email'
            value={email}
            errorMessage={validate.email ? '' : 'Please input valid email'}
            onChangeText={email => this.setState({ email })}
          />
          <Input
            placeholder='Password'
            secureTextEntry={!validate.show_password}
            value={password}
            isVisiblePassword={validate.show_password}
            onVisiblePassword={() => {
              this.setValidateState({ show_password: !validate.show_password })
            }}
            errorMessage={validate.password ? '' : 'Please input password'}
            InputComponent={PasswordInput}
            onChangeText={password => this.setState({ password })}
          />

          <Input
            placeholder='Confirm Password'
            secureTextEntry={!validate.show_confirm_password}
            value={confirmPassword}
            isVisiblePassword={validate.show_confirm_password}
            onVisiblePassword={() => {
              this.setValidateState({ show_confirm_password: !validate.show_confirm_password })
            }}
            errorMessage={validate.confirm_password ? '' : 'Confirm password no match'}
            InputComponent={PasswordInput}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Switch value={isAdmin} onValueChange={isAdmin => this.setState({ isAdmin })} /><Text headline>Register with Admin?</Text>
          </View>
          <View style={{ flex: 1 }} />

          <Button
            title="Create"
            buttonStyle={styles.actions}
            containerStyle={styles.m_10}
            onPress={this.register.bind(this)}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(LogIn);