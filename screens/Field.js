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

    const { field } = this.props.route.params;

    const data = {
      labels: Object.keys(field.forecast).map(s => s.substr(5)),
      datasets: [{
        data: Object.values(field.forecast)
      }]
    };

    return (
      <Block
       flex
       style={styles.field}>
        <ScrollView>
          <Text>
            {field.name}
          </Text>

          <BarChart
            data={data}
            fromZero={true}
            chartConfig={chartConfig}
            height={220}
            width={width}
            yLabelsOffset={36}
          />

        </ScrollView>
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