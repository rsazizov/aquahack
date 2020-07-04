
import React, { useState } from 'react';
import MapView, {
	PROVIDER_GOOGLE,
	Marker
} from 'react-native-maps';

const Map = (props) => {
  return (
		<MapView
			mapType={'satellite'}
			style={{ height: 400 }}
			provider={PROVIDER_GOOGLE}
			initialRegion={{
				latitude: props.lat,
				longitude: props.lon,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}}>
			<Marker
				onDragEnd={e => {
					props.onDragEnd({
						lat: e.nativeEvent.coordinate.latitude,
						lon: e.nativeEvent.coordinate.longitude
					})
				}}
				draggable
				coordinate={{
					latitude: props.lat,
					longitude: props.lon,
				}}>
			</Marker>
		</MapView>
	);
}

export default Map;
