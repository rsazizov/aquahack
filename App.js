import React, {useState} from "react";
import { Image, YellowBox } from "react-native";
import { useFonts } from '@use-expo/font';
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";

// Before rendering any navigation stack
import { enableScreens, useScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { Images, argonTheme } from "./constants";

// cache app images
const assetImages = [
];

// cache product images
// articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default props => {
  console.disableYellowBox = true;
  const [isLoadingComplete, setLoading] = useState(false);
  const [apiToken] = useState(null);

  function onHasToken(apiToken) {
    this.setState({apiToken})
  }

  let [fontsLoaded] = useFonts({
    'ArgonExtra': require('./assets/font/argon.ttf'),
  });

  function _loadResourcesAsync() {
    return Promise.all([...cacheImages(assetImages)]);
  }

  function _handleLoadingError(error) {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

 function _handleFinishLoading() {
    setLoading(true);
  };

  // if(!fontsLoaded && !isLoadingComplete) {
  //   return (
  //     <AppLoading
  //       startAsync={_loadResourcesAsync}
  //       onError={_handleLoadingError}
  //       onFinish={_handleFinishLoading}
  //     />
  //   );
  // } else if(fontsLoaded) {
    return (
      <NavigationContainer>
        <GalioProvider theme={argonTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );
  // }
}