import React from 'react';
import { StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { Block, Text, Card, theme } from 'galio-framework';

import AnnotatedText from '../components/AnnotatedText';

// import { Card } from '../components';
const { width } = Dimensions.get('screen');

import { store, dispatcher } from '../store';
import { Container } from 'flux/utils';

import {
  LineChart
} from 'react-native-chart-kit';

import { argonTheme } from '../constants';

import * as services from '../services';
import FieldCard from '../components/FieldCard';

class Home extends React.Component {
  renderStats = () => {
    const line = {
      datasets: [
        {
          data: [20, 45, 32, 65, 40, 53, 41, 52, 40]
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

    return (
      <Block middle style={{marginBottom: theme.SIZES.BASE * 2}}>
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

        <Block flex row style={{width}} space='around'>
          <AnnotatedText text="154.32" annot="AZN" />
          <AnnotatedText text="1054.5" annot="Liters" />
        </Block>
      </Block>
    );
  }

  constructor(props) {
    super(props);
    this.renderFieldCard = this.renderFieldCard.bind(this);
  }

  viewField(name) {
    this.props.navigation.navigate("Field", {field: name});
  }

  renderFieldCard(field) {
    return (
      <FieldCard 
        title={field.name}
        // ndvi={field.ndvi}
        // water={field.water}
        ndvi={0}
        water={0}
        onPress={this.viewField.bind(this, field.name)}
        />
    );
  }

  componentDidMount(props) {
    services.getFields().then((res) => {
      for (let field of res.fields) {
        dispatcher.dispatch({
          type: 'ADD_FIELD',
          name: field.name,
          apiKey: field.apiKey
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

const HomeContainer = Container.createFunctional(
  (props) => (<Home fields={props.fields} />),
  () => {
    return [store];
  }, 
  () => {
    return {
      fields: store.getState()
    }
  }
 );

export default HomeContainer;