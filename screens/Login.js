import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";

import { Block, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";

const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";

import * as services from '../services';
import { SafeAreaView } from "react-native-safe-area-context";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      hadErorr: false
    }

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    services.getToken(this.state.username, this.state.password)
      .then(() => {
        this.props.navigation.navigate("App");
      }).catch(() => this.setState({hadErorr: true}));
  }

  renderError() {
    if (this.state.hadErorr) {
      return (
        <Block flex middle top={false} style={styles.error}>
          <Text color={argonTheme.COLORS.INPUT_ERROR}>Something went wrong</Text>
        </Block>
      );
    } else {
      return (
        <Block flex middle top={false} style={styles.error}>
        </Block>
      );
    }
  }
  
  render() {
    StatusBar.setBarStyle('light-content', true);

    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <Image
          source={Images.LoginLanding}
          style={{ height: 350, width, zIndex: 1 }}
        />
        <Block flex center style={styles.loginForm}>
          <Block width={width * 0.8} style={{ marginBottom: 15 }}>
            <Input
              borderless
              placeholder="Username"
              onChangeText={(username => this.setState({ username }))}
              iconContent={
                <Icon
                  size={16}
                  color={argonTheme.COLORS.ICON}
                  name="ic_mail_24px"
                  family="ArgonExtra"
                  style={styles.inputIcons}
              />
              }
            />

            <Input
              password
              borderless
              placeholder="Password"
              name="password"
              onChangeText={(password => this.setState({ password }))}
              iconContent={
                <Icon
                  size={16}
                  color={argonTheme.COLORS.ICON}
                  name="padlock-unlocked"
                  family="ArgonExtra"
                  style={styles.inputIcons}
                />
              }
            />

            <Button onPress={this.handleLogin} color="primary" style={styles.loginButton}>
              <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                Login
              </Text>
            </Button>
          </Block>

        </Block>


        {this.renderError()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.WHITE,
  },
  inputIcons: {
    marginRight: 12
  },
  loginForm: {
    marginVertical: theme.SIZES.BASE,
  },
  error: {
  },
  footer: {
    position: 'absolute',
    bottom: theme.SIZES.BASE,
    left: 40
  },
  loginButton: {
    width: width - theme.SIZES.BASE * 4 - 6,
    height: theme.SIZES.BASE * 4,
    marginVertical: theme.SIZES.BASE,
    shadowRadius: 0,
    shadowOpacity: 0
  },
});

export default Login;
