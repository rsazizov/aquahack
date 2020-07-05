import React from "react";
import { KeyboardAvoidingView, Dimensions, SafeAreaView, View } from "react-native";
import { Text, Block, theme} from "galio-framework";
import { argonTheme } from '../constants';
import CustomMap from '../components/CustomMap';
import Button from '../components/Button'
import Select from '../components/Select'
import Icon from '../components/Icon'
import Input from '../components/Input'

const { width } = Dimensions.get('screen');

import * as services from '../services';
import { dispatcher } from '../store';

class AddField extends React.Component {
  state = {
    gps: {
      lat: 40.483994,
      lon: 49.801848
    },
    fieldName: '',
    crop: '',
    area: 0
  }

  inputs = []

  constructor(props) {
    super(props);
    this.in1 = React.createRef();
    this.in2 = React.createRef();
    this.in3 = React.createRef();
  }

  handleAddField = () => {
    const { fieldName, gps, area, crop } = this.state;
    services.addField(fieldName, gps, area, crop) .then((json) => {
      dispatcher.dispatch({
        type: 'ADD_FIELD',
        name: json.name,
        apiId: json.apiId,
        forecast: json.forecast,
        waterPrice: json.waterPrice
      })
    }).catch((err) => {
      console.warn(err);
    });
  }

  render() {
    const { lat, lon } = this.state.gps;
    const inputs = this.inputs;

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
              marginTop: 150,
              width: width * 0.8,
            }}>

              <Input
                borderless
                ref={this.in1}
                placeholder="Field name"
                onChangeText={(fieldName => this.setState({ fieldName }))}
                iconContent={null}
              />

              <Input
                borderless
                ref={this.in2}
                placeholder="Area (km2)"
                onChangeText={(area => this.setState({ area }))}
                iconContent={null}
              />

              <Input
                borderless
                ref={this.in3}
                placeholder="Crop"
                onChangeText={(crop => this.setState({ crop }))}
                iconContent={null}
              />

              <Button 
                onPress={this.handleAddField}
                style={{
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
    flex: 1,
    height: 400,
    zIndex: -1,
  }
}

export default AddField;