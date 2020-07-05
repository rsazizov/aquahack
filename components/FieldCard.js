import React from 'react';
import { StyleSheet, Dimensions, TouchableNativeFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { argonTheme } from '../constants';

const { width } = Dimensions.get('screen');

export default (props) => {
  return (
    <TouchableNativeFeedback
      onPress={props.onPress}>
      <Block
        card={true}
        shadow={true}
        style={styles.card}
        flex
        row
        justifyContent='space-between'
        alignItems='center'>

        <Block
          row>
          <Text color={argonTheme.COLORS.SECONDARY} h5>{props.title}</Text>
        </Block>

        <Block row>
          <Text color={argonTheme.COLORS.SECONDARY}>{props.water} ML</Text>
        </Block>
      </Block>
    </TouchableNativeFeedback >
  );
}

const styles = StyleSheet.create({
  card: {
    height: 50,
    padding: 10,
    marginBottom: theme.SIZES.BASE / 2,
    backgroundColor: argonTheme.COLORS.PRIMARY
  }
});