import * as reduxActions from "@actions";
import { Header, PasswordInput } from "@components";
import { BaseColor } from "@config";
import React, { Component } from "react";
import { View } from "react-native";
import { Button, Icon, Input } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import { t } from "@utils";
import styles from "./styles";

class LogIn extends Component {
  state = {
    name: "", //Worker
    email: '', //worker@rating.com
    password: '', //test12345
    confirmPassword: '', //test12345
    phonenumber: '', //+1234567890
    role: 1, //1: clients 2: workers
    validate: {
      name: true,
      email: true,
      phonenumber: true,
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
    const { email, password, confirmPassword, name, role, phonenumber } = this.state;
    this.setValidateState({
      email: reg.test(email),
      password: !!password,
      confirm_password: password == confirmPassword,
      name: !!name,
      phonenumber: !!phonenumber,
    })
    if (!reg.test(email) || !password || password != confirmPassword, !name) {
      return;
    }
    this.setState({ registering: true });
    this.props.register(email, password, name, phonenumber, role, res => {
      this.setState({ registering: false });
      if (res.success) {
        Toast.showWithGravity(res.message || t('Register success.'), Toast.SHORT, Toast.TOP);
        this.props.navigation.navigate("LogIn");
      } else {
        Toast.showWithGravity(res.message || t('Register failed, please try again later.'), Toast.SHORT, Toast.TOP);
      }
    })
  }
  render() {
    const { name, email, password, phonenumber, confirmPassword, validate, registering, role } = this.state;
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
            placeholder={t('User Name')}
            value={name}
            errorMessage={validate.name ? '' : t('Please input User Name')}
            onChangeText={name => this.setState({ name })}
          />
          <Input
            placeholder={t('Email')}
            value={email}
            errorMessage={validate.email ? '' : t('Please input valid email')}
            onChangeText={email => this.setState({ email })}
          />
          <Input
            placeholder={t('Phone number')}
            value={phonenumber}
            keyboardType={'phone-pad'}
            errorMessage={validate.phonenumber ? '' : t('Please input Phone number')}
            onChangeText={phonenumber => this.setState({ phonenumber })}
          />
          <Input
            placeholder={t('Password')}
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
            placeholder={t('Confirm Password')}
            secureTextEntry={!validate.show_confirm_password}
            value={confirmPassword}
            isVisiblePassword={validate.show_confirm_password}
            onVisiblePassword={() => {
              this.setValidateState({ show_confirm_password: !validate.show_confirm_password })
            }}
            errorMessage={validate.confirm_password ? '' : t('Confirm password no match') }
            InputComponent={PasswordInput}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
          />
          {/* <Text headline>Role</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckBox
              style={{ flex: 1 }}
              checked={role == 1}
              title='Client'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              onPress={() => this.setState({ role: 1 })}
            />
            <CheckBox
              style={{ flex: 1 }}
              title='Co-Worker'
              checked={role == 2}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              onPress={() => this.setState({ role: 2 })}
            />
          </View> */}
          <View style={{ flex: 1 }} />

          <Button
            title={t("Create")}
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