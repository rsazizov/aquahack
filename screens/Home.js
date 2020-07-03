import React from 'react';
import { StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { Block, Text, Card, theme } from 'galio-framework';

// import { Card } from '../components';
const { width } = Dimensions.get('screen');

import {
  LineChart
} from 'react-native-chart-kit';
import { argonTheme } from '../constants';

class Home extends React.Component {
  renderStats = () => {
    const line = {
      datasets: [
        {
          data: [20, 45, 32, 65, 40, 53]
        }
      ]
    };

    const chartConfig = {
      backgroundGradientFrom: argonTheme.COLORS.SECONDARY,
      backgroundGradientTo: argonTheme.COLORS.SECONDARY,
      decimalPlaces: 1,
      color: (opacity = 1) => `rgba(94, 114, 228, ${opacity})`,
      style: {
        borderRadius: 16
      }
    };

    const AnnotatedText = (props) => {
      return (
        <Block column middle>
          <Text h4 color={argonTheme.COLORS.PRIMARY}>{props.text}</Text>
          <Text h6 color={argonTheme.COLORS.MUTED}>{props.annot}</Text>
        </Block>
      );
    }

    return (
      <Block middle>
        <LineChart
          data={line}
          chartConfig={chartConfig}
          style={styles.chart}
          height={220}
          width={width}
          segments={0}
          withInnerLines={false}
          withOuterLines={false}
          yLabelsOffset={36}
          bezier
        >
        </LineChart>

        <Block flex row style={{width}} space='around'>
          <AnnotatedText text="154.32" annot="AZN" />
          <AnnotatedText text="1054.5" annot="Liters" />
        </Block>
      </Block>
    );
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}>

          {this.renderStats()}

        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width - theme.SIZES.BASE * 2
  },
  chart: {
    marginTop: theme.SIZES.BASE,
  },
  scroll: {
    marginTop: theme.SIZES.BASE,
  },
  chartText: {
    position: 'absolute',
    left: 36,
    top: 10
  }
});

export default Home;
