

import React, { Component, useState, useEffect, setState } from 'react';
import { View, Text, TextInput, Dimensions, Button, TouchableOpacity, Style } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polygon, ProviderPropType } from 'react-native-maps';
const CustomMap = () => {
    const INITIAL_REGION = {
        latitude: 40.3793,
        longitude: 49.8071,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }
    const id = 0;
    const [enteredPoint, setEnteredPoint] = useState();
    const [points, setPoints] = useState([
        { id: '0', latitude: 40.3793, longitude: 49.8071 },
        { id: '1', latitude: 40.3793 + 0.1, longitude: 49.8071 },
        { id: '2', latitude: 40.3793 + 0.1, longitude: 49.8071 + 0.1 },
        { id: '3', latitude: 40.3793, longitude: 49.8071 + 0.1 }
    ]);



    // const createNewPoint = (touchCoordinate) => {
    //     setEnteredPoint({ id: id, latitude: touchCoordinate.latitude, longitude: touchCoordinate.longitude });
    //     console.log('created');
    //     setState({ id: id + 1 });
    // }
    // const handlePoints = () => {
    //     setPoints(points => [...points, eneteredPoint]);
    // }
    // const returnRes = () => {
    //     console.log(points);
    // }

    useEffect(() => {
        setPoints(points)
    }, [points]);

    return (
        <View>
            <MapView
                mapType={"hybrid"}
                style={{ height: 500 }}
                provider={PROVIDER_GOOGLE}
                initialRegion={INITIAL_REGION}
            >
                {points.map((point) => (
                    <Marker draggable
                        key={point.id}
                        coordinate={point}>
                    </Marker>
                ))}
                <Polygon
                    strokeWidth={3}
                    fillColor={'rgba(80, 220, 100, 0.2)'}
                    strokeColor={'rgba(80, 220, 100, 0.8)'}
                    coordinates={points}></Polygon>

            </MapView>
        </View>
    );
}

export default CustomMap;




// import React, { Component, useState, useEffect } from 'react';
// import { View, Text, TextInput, Dimensions, Button, TouchableOpacity, Style } from 'react-native'
// import MapView, {MAP_TYPES, PROVIDER_GOOGLE, Marker, Callout, Polygon, ProviderPropType } from 'react-native-maps';
// import * as Location from 'expo-location';


// const Map = () => {
//     const [userLocation, setUserLocation] = useState(null);
//     const [errorMsg, setErrorMsg] = useState(null);
//     useEffect(() => {
//         (async () => {
//             let { status } = await Location.requestPermissionsAsync();
//             if (status !== 'granted') {
//                 setErrorMsg('Permission to access location was denied');
//             }

//             let newLocation = await Location.getCurrentPositionAsync({});
//             setUserLocation(newLocation);
//         })();
//     });

//     let text = 'Waiting..';
//     if (errorMsg) {
//         text = errorMsg;
//     } else if (userLocation) {
//         text = JSON.stringify(userLocation);
//     }
//     state = {
//         coordinates: [
//             { id: 1, latitude: 37.802529, longitude: -122.43513 },
//             { id: 2, latitude: 37.789629, longitude: -122.42164 },
//             { id: 3, latitude: 37.766529, longitude: -122.41614 },
//             { id: 4, latitude: 37.773529, longitude: -122.45914 },
//         ]
//     }
//     const previousLocations = [];
//     const aim = { latitude: 37.802529, longitude: -122.43513 };
//     const handleAddLocation = ({ latitude: lat, longitude: lon }) => {
//         let newLocation = { latitude: { lat }, longitude: { lon } };
//         setLocation(previousLocations => [...previousLocations, newLocation]);
//         console.log(previousLocations);
//     }

//     return (
//         <View style={{ backgroundColor: 'red', height: Dimensions.get('window').height, borderColor: 'blue', borderWidth: 5 }}>
//             <View style={{ marginVertical: '10%' }}>
//                 <Text>{text}</Text>
//             </View>
//             <MapView
//                 mapType={'standard'}
//                 style={{ height: 600 }}
//                 provider={PROVIDER_GOOGLE}
//                 initialRegion={{
//                     latitude: 37.78825,
//                     longitude: -122.4324,
//                     latitudeDelta: 0.0922,
//                     longitudeDelta: 0.0421,
//                 }}
//             >
//                 <Polygon tappable
//                     coordinates={state.coordinates}
//                     strokeWidth={3}
//                     fillColor={'rgba(80, 220, 100, 0.2)'}
//                     strokeColor={'rgba(80, 220, 100, 0.8)'}
//                 ></Polygon>
//                 <Marker draggable
//                     coordinate={state.coordinates[0]}>
//                 </Marker>
//                 <Marker draggable
//                     coordinate = {state.coordinates[1]}>
//                 </Marker>
//                 <Marker draggable
//                     coordinate={state.coordinates[2]}>
//                 </Marker>
//                 <Marker draggable
//                     coordinate={state.coordinates[3]}>
//                 </Marker>
//             </MapView>

//             <Button title='add'>
//             </Button>
//         </View>

//     );
// }


// export default Map;






// import React, { Component, useState, useEffect } from 'react';
// import { View, Text, TextInput, Dimensions, Button, TouchableOpacity, Style } from 'react-native'
// import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polygon, ProviderPropType } from 'react-native-maps';
// import * as Location from 'expo-location';


// const updateMarkerCoordinate = (lat, lon, marker, state) => {
//     for (var i = 0; i < state.markers.length; i++) {
//         if (state.markers[i].title === marker.title) {
//             state.markers[i].coordinates = { latitude: lat, longitude: lon };
//         }
//     }
// }

// class MapCreator extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             markers: [{
//                 title: '1',
//                 coordinates: {
//                     latitude: 3.148561,
//                     longitude: 101.652778
//                 },
//             },
//             {
//                 title: '2',
//                 coordinates: {
//                     latitude: 3.149771,
//                     longitude: 101.655449
//                 },
//             },
//             {
//                 title: '3',
//                 coordinates: {
//                     latitude: 3.147771,
//                     longitude: 101.655449
//                 },
//             },
//             {
//                 title: '4',
//                 coordinates: {
//                     latitude: 3.150771,
//                     longitude: 101.655449
//                 },
//             }],
//             poligon: {
//                 coordinates: []
//             }
//         }

//     }

//     render() {
//         // console.log(this.state.markers.length);
//         const { markers } = this.state;
//         for (var i = 0; i < this.state.markers.length; i++) {
//             this.state.poligon.coordinates.push(this.state.markers[i].coordinates);
//             console.log(this.state.poligon.coordinates)
//         }
//         console.log(this.state.markers);
//         return (
//             <View style={{ height: 600, backgroundColor: 'red' }}>

//                 <MapView
//                     mapType={'standard'}
//                     style={{ height: 400 }}
//                     provider={PROVIDER_GOOGLE}
//                     initialRegion={{
//                         latitude: 3.148561,
//                         longitude: 101.652778,
//                         latitudeDelta: 0.0922,
//                         longitudeDelta: 0.0421,
//                     }} >
//                     {this.state.markers.map(marker => (
//                         <Marker
//                             key={marker.title}
//                             draggable
//                             onDragEnd={e => updateMarkerCoordinate(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, marker, this.state)}
//                             coordinate={marker.coordinates}
//                             title={marker.title}
//                         ></Marker>
//                     ))}
//                     <Polygon
//                         strokeWidth={3}
//                         coordinates={this.state.poligon.coordinates}></Polygon>
//                 </MapView>
//             </View>
//         )

//     }
// }

// export default MapCreator;








////Interesting to checkout////

// import React from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   Dimensions,
//   TouchableOpacity,
// } from 'react-native';

// import MapView, {
//   MAP_TYPES,
//   Polygon,
//   ProviderPropType,
// } from 'react-native-maps';

// const { width, height } = Dimensions.get('window');

// const ASPECT_RATIO = width / height;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// let id = 0;

// class PolygonCreator extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       region: {
//         latitude: LATITUDE,
//         longitude: LONGITUDE,
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//       },
//       polygons: [],
//       editing: null,
//       creatingHole: false,
//     };
//   }

//   finish() {
//     const { polygons, editing } = this.state;
//     this.setState({
//       polygons: [...polygons, editing],
//       editing: null,
//       creatingHole: false,
//     });
//   }

//   createHole() {
//     const { editing, creatingHole } = this.state;
//     if (!creatingHole) {
//       this.setState({
//         creatingHole: true,
//         editing: {
//           ...editing,
//           holes: [...editing.holes, []],
//         },
//       });
//     } else {
//       const holes = [...editing.holes];
//       if (holes[holes.length - 1].length === 0) {
//         holes.pop();
//         this.setState({
//           editing: {
//             ...editing,
//             holes,
//           },
//         });
//       }
//       this.setState({ creatingHole: false });
//     }
//   }

//   onPress(e) {
//     const { editing, creatingHole } = this.state;
//     if (!editing) {
//       this.setState({
//         editing: {
//           id: id++,
//           coordinates: [e.nativeEvent.coordinate],
//           holes: [],
//         },
//       });
//     } else if (!creatingHole) {
//       this.setState({
//         editing: {
//           ...editing,
//           coordinates: [...editing.coordinates, e.nativeEvent.coordinate],
//         },
//       });
//     } else {
//       const holes = [...editing.holes];
//       holes[holes.length - 1] = [
//         ...holes[holes.length - 1],
//         e.nativeEvent.coordinate,
//       ];
//       this.setState({
//         editing: {
//           ...editing,
//           id: id++, // keep incrementing id to trigger display refresh
//           coordinates: [...editing.coordinates],
//           holes,
//         },
//       });
//     }
//   }

//   render() {
//     const mapOptions = {
//       scrollEnabled: true,
//     };

//     if (this.state.editing) {
//       mapOptions.scrollEnabled = false;
//       mapOptions.onPanDrag = e => this.onPress(e);
//     }

//     return (
//       <View style={styles.container}>
//         <MapView
//           provider={this.props.provider}
//           style={styles.map}
//           mapType={MAP_TYPES.HYBRID}
//           initialRegion={this.state.region}
//           onPress={e => this.onPress(e)}
//           {...mapOptions}
//         >
//           {this.state.polygons.map(polygon => (
//             <Polygon
//               key={polygon.id}
//               coordinates={polygon.coordinates}
//               holes={polygon.holes}
//               strokeColor="#F00"
//               fillColor="rgba(255,0,0,0.5)"
//               strokeWidth={1}
//             />
//           ))}
//           {this.state.editing && (
//             <Polygon
//               key={this.state.editing.id}
//               coordinates={this.state.editing.coordinates}
//               holes={this.state.editing.holes}
//               strokeColor="#000"
//               fillColor="rgba(255,0,0,0.5)"
//               strokeWidth={1}
//             />
//           )}
//         </MapView>
//         <View style={styles.buttonContainer}>
//           {this.state.editing && (
//             <TouchableOpacity
//               onPress={() => this.createHole()}
//               style={[styles.bubble, styles.button]}
//             >
//               <Text>
//                 {this.state.creatingHole ? 'Finish Hole' : 'Create Hole'}
//               </Text>
//             </TouchableOpacity>
//           )}
//           {this.state.editing && (
//             <TouchableOpacity
//               onPress={() => this.finish()}
//               style={[styles.bubble, styles.button]}
//             >
//               <Text>Finish</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   }
// }

// PolygonCreator.propTypes = {
//   provider: ProviderPropType,
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   bubble: {
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     borderRadius: 20,
//   },
//   latlng: {
//     width: 200,
//     alignItems: 'stretch',
//   },
//   button: {
//     width: 80,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     marginVertical: 20,
//     backgroundColor: 'transparent',
//   },
// });

// export default PolygonCreator;
