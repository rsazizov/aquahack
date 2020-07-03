
import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polygon } from 'react-native-maps';

const Map = () => {
    return (
        <View style={{backgroundColor: 'red', height: Dimensions.get('window').height, borderColor: 'blue', borderWidth: 5 }}>
            <MapView 
                mapType	= {'standard'}
                style={{height: 800 }}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>
                <Marker draggable
                    coordinate={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                    }}>
                    <Callout>
                        <Text>Hello</Text>
                    </Callout>
                </Marker>
            </MapView>
        </View>

    );
}
export default Map;
