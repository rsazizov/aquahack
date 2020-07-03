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

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    alert('meow');
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

        <Block middle top={false} style={styles.footer}>
            <Text color={argonTheme.COLORS.MUTED}>Dont't have an account?</Text>
            <Text color={argonTheme.COLORS.ACTIVE}>Contact us.</Text>
        </Block>
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
  footer: {
    marginBottom: theme.SIZES.BASE,
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
