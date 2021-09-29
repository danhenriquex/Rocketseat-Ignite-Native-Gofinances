import React, { useState } from "react";
import { View, Text, Alert, ActivityIndicator, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../hooks/auth";
import { useTheme } from "styled-components";
import { IconGoogle, IconApple, IconLogo } from "../../assets";
import { SignInSocialButton } from "../../components/SignInSocialButton";
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from "./styles";

export function SignIn() {
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setLoading(true);

      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível conectar a conta Google");
      setLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setLoading(true);

      return await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível conectar a conta Apple");
      setLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <IconLogo width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {"\n"} finanças de forma {"\n"} muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {"\n"} uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={IconGoogle}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === "ios" && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={IconApple}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {loading && (
          <ActivityIndicator
            color={theme.colors.shape}
            size="small"
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  );
}
