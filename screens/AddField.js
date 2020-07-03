import React from "react";
import { KeyboardAvoidingView, Dimensions, SafeAreaView, View } from "react-native";
import { Text, Block, theme} from "galio-framework";
import { argonTheme } from '../constants';
import CustomMap from '../components/CustomMap';
import Button from '../components/Button'
import Icon from '../components/Icon'
import Input from '../components/Input'

const { width } = Dimensions.get('screen');
import { LineChart, BarChart } from 'react-native-chart-kit';

import * as services from '../services';

class AddField extends React.Component {

  state = {
    gps: {lon: 0, lat: 0},
    fieldName: ''
  }

  handleAddField = () => {
    const { fieldName, gps } = this.state;
    services.addField(fieldName, gps)
  }

  render() {
    // tesevvur eliyin guya gps var burda
    const lat = 40.486904;
    const lon = 49.801114;

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
      >
        <SafeAreaView
          style={styles.addField}>
          <View style={styles.inner}>

            <Block style={styles.mapContainer}>
              <CustomMap
                lat={lat}
                lon={lon}
                onDragEnd={gps => this.setState({ gps })}
              />
            </Block>

            <Block center style={{
              flex: 1,
              marginTop: 20,
              width: width * 0.8,
            }}>

              <Input
                borderless
                placeholder="Field name"
                onChangeText={(fieldName => this.setState({ fieldName }))}
                iconContent={null}
              />

              <Button 
                onPress={this.handleAddField}
                style={{
                  marginTop: 45,
                  width: width * 0.8,
                }}>
                <Text color={argonTheme.COLORS.SECONDARY}>
                  Add
                </Text>
              </Button>
            </Block>

          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  addField: {
    backgroundColor: argonTheme.COLORS.SECONDARY,
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  mapContainer: {
    width,
    height: 400,
  }
}

export default AddField;