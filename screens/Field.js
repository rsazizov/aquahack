import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Text, Block, theme} from "galio-framework";
import { argonTheme } from '../constants';
import Select from '../components/Select'

const { width } = Dimensions.get('screen');
import { LineChart, BarChart } from 'react-native-chart-kit';

class Field extends React.Component {

  render() {
    const chartConfig = {
      backgroundGradientFrom: argonTheme.COLORS.SECONDARY,
      backgroundGradientTo: argonTheme.COLORS.SECONDARY,
      decimalPlaces: 1,
      color: (opacity = 1) => `rgba(94, 114, 228, ${opacity})`,
      style: {
        borderRadius: 16
      }
    };
    const line = {
      datasets: [
        {
          data: [20, 45, 32, 65, 40, 53, 41, 52, 40]
        }
      ]
    };

    return (
      <Block
       flex
       style={styles.field}>
        <Text>
         {this.props.route.params.field.toString()}
          Today you need 10 L
        </Text>
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
        >
        </LineChart>

        <LineChart
          data={line}
          chartConfig={chartConfig}
          height={220}
          width={width}
          segments={0}
          withInnerLines={false}
          withOuterLines={false}
          yLabelsOffset={36}
        >
        </LineChart>

        <BarChart
          data={line}
          chartConfig={chartConfig}
          height={220}
          width={width}
          yLabelsOffset={36}
        />

      </Block>
    )

    return <Text></Text>;
  }
}

const styles = {
  field: {
    backgroundColor: argonTheme.COLORS.SECONDARY
  },
  chart: {
    marginTop: theme.SIZES.BASE,
  }
}

export default Field;