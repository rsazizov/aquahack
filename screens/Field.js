import React from "react";
import { ScrollView, StyleSheet, Dimensions, Image } from "react-native";
import { Text, Block, theme} from "galio-framework";
import { argonTheme } from '../constants';

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

    const latest = data.datasets[0].data[0].toFixed(2);

    return (
      <Block
       flex
       style={styles.field}>
        <ScrollView>
          <Text style={{
            color: argonTheme.COLORS.PRIMARY,
            marginLeft: 10,
            marginVertical: theme.SIZES.BASE
          }} h3>
            {field.name}
          </Text>

          <Text style={{
            color: argonTheme.COLORS.PRIMARY,
            marginBottom: theme.SIZES.BASE / 2,
            marginLeft: 10,
          }} h4>
            Overview
          </Text>

          <BarChart
            data={data}
            fromZero={true}
            chartConfig={chartConfig}
            height={220}
            width={width - 20}
            yLabelsOffset={30}
          />

          <Text style={{
            marginTop: theme.SIZES.BASE,
            marginLeft: 10,
          }} h5>
            Today you'll need {latest} megaliters.
          </Text>

          {/* <Text style={{
            color: argonTheme.COLORS.PRIMARY,
            marginLeft: 10,
            marginVertical: theme.SIZES.BASE
          }} h4>
            Health
          </Text>

          <Image
            style={{
              width,
              height: 300
            }}
            source={{ uri: "192.168.1.66:5000/api/ndvi/" + field.apiId}}>
          </Image> */}
        </ScrollView>
      </Block>
    );
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