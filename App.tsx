import "intl";
import "intl/locale-data/jsonp/pt-BR";
import "react-native-gesture-handler";
import React from "react";
import { ThemeProvider } from "styled-components";
import { NavigationContainer } from "@react-navigation/native";
import { CategorySelect } from "./src/screens/CategorySelect";
import { Dashboard } from "./src/screens/Dashboard";
import { SignIn } from "./src/screens/SignIn";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";
import { StatusBar } from "react-native";
import { Routes } from "./src/routes";
import { AuthProvider, useAuth } from "./src/hooks/auth";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  const { userFromStorageLoading } = useAuth();

  if (!fontsLoaded || userFromStorageLoading) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
