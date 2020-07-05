import React from 'react';
import { StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { Block, Text, Card, theme } from 'galio-framework';

import AnnotatedText from '../components/AnnotatedText';

import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('screen');

import { store, dispatcher } from '../store';
import { Container } from 'flux/utils';

import {
  LineChart, PieChart
} from 'react-native-chart-kit';

import { argonTheme } from '../constants';

import * as services from '../services';
import FieldCard from '../components/FieldCard';

class Home extends React.Component {
  hashcode(str) { // java string#hashcode
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return hash;
  }

  intToRGB(i) {
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  renderStats = () => {
    const data = [];

    for (let field of this.props.fields) {
      data.push({
        name: field.name,
        water: (Object.values(field.forecast) || []).reduce((a, b) => a + b, 0),
        color: '#' + this.intToRGB(this.hashcode(field.name)),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      });
    }

    if (data.length === 0) {
      return <Text color={argonTheme.COLORS.MUTED}>Loading...</Text>
    }

    const chartConfig = {
      backgroundGradientFrom: argonTheme.COLORS.SECONDARY,
      backgroundGradientTo: argonTheme.COLORS.SECONDARY,
      decimalPlaces: 1,
      color: (opacity = 1) => `rgba(94, 114, 228, ${opacity})`,
      style: {
        borderRadius: 16
      }
    };

    let totalWater = 0;
    for (let field of this.props.fields) {
      totalWater += Object.values(field.forecast).reduce((a, b) => a + b, 0);
    }

    let totalPrice = 0;
    for (let field of this.props.fields) {
      totalPrice += Object.values(field.forecast).reduce((a, b) => a + b, 0) * field.waterPrice;
    }

    return (
      <Block middle style={{marginBottom: theme.SIZES.BASE * 2}}>
          <PieChart
            data={data}
            chartConfig={chartConfig}
            // style={styles.chart}
            height={220}
            width={width}
            accessor={"water"}
            paddingLeft={15}
            // segments={0}
            // withInnerLines={false}
            // withOuterLines={false}
            // yLabelsOffset={36}
          /> 

        <Block flex row style={{width}} space='around'>
          <AnnotatedText text={totalPrice.toFixed(1)} annot="AZN" />
          <AnnotatedText text={totalWater.toFixed(1)} annot="Megalitres" />
        </Block>
      </Block>
    );
  }

  constructor(props) {
    super(props);
    this.renderFieldCard = this.renderFieldCard.bind(this);
  }

  viewField(name) {
    const field = this.props.fields.find(f => f.name === name)
    this.props.navigation.navigate("Field", {field});
  }

  renderFieldCard(field) {
    let forecast = Object.values(field.forecast);
    return (
      <FieldCard 
        title={field.name}
        key={field.apiId}
        water={(forecast[0] || 0).toFixed(2)}
        onPress={this.viewField.bind(this, field.name)}
        />
    );
  }

  componentDidMount(props) {
    services.getFields().then((res) => {
      for (let field of res.fields) {
        dispatcher.dispatch({
          type: 'ADD_FIELD',
          apiId: field.apiId,
          name: field.name,
          water: field.water,
          forecast: field.forecast,
          waterPrice: field.waterPrice
        });
      }
    });
  }

  render() {
    return (
      <Block center style={styles.home}>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}>

          {this.renderStats()}
          {this.props.fields.map(this.renderFieldCard)}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  chart: {
    marginTop: theme.SIZES.BASE,
  },
  scroll: {
    marginTop: theme.SIZES.BASE,
  }
});

class HomeContainer extends React.Component {

  super(props) {
    this.super(props);
  }

  static getStores() {
    return [store];
  }

  static calculateState() {
    return {
      fields: store.getState()
    }
  }
  
  render() {
    return <Home {...this.props} {...this.state}/>
  }

}

export default Container.create(HomeContainer);