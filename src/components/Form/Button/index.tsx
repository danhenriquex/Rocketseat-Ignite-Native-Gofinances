import React from "react";
import { TouchableOpacityProps } from "react-native";
import { RectButtonProps } from "react-native-gesture-handler";

import { View, Text } from "react-native";

interface Props extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
}

import { Container, Title } from "./styles";

export function Button({ title, onPress, ...rest }: Props) {
  return (
    <Container {...rest} onPress={onPress}>
      <Title>{title}</Title>
    </Container>
  );
}
