import "intl";
import "intl/locale-data/jsonp/pt-BR";
import "react-native-gesture-handler";
import React from "react";
import { ThemeProvider } from "styled-components";
import { NavigationContainer } from "@react-navigation/native";
import { CategorySelect } from "./src/screens/CategorySelect";
import { Dashboard } from "./src/screens/Dashboard";
import { Register } from "./src/screens/Register";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";
import { StatusBar } from "react-native";
import { AppRoutes } from "./src/routes/app.routes";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  );
}
