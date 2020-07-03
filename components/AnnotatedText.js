import React from 'react';
import { Block, Text } from 'galio-framework';
import { argonTheme } from '../constants';

export default (props) => {
  return (
    <Block column middle>
      <Text h4 color={argonTheme.COLORS.PRIMARY}>{props.text}</Text>
      <Text h6 color={argonTheme.COLORS.MUTED}>{props.annot}</Text>
    </Block>
  );
}