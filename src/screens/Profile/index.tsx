import React from "react";
import { View, Text, TextInput, Button } from "react-native";

export function Profile() {
  return (
    <View>
      <Text testID="text-title">Profile</Text>
      <TextInput
        testID="input-name"
        value="Rodrigo"
        placeholder="Nome"
        autoCorrect={false}
      />
      <TextInput
        testID="input-surname"
        placeholder="Sobrenome"
        autoCorrect={false}
        value="Gonçalves"
      />

      <Button title="Salvar" onPress={() => {}} />
    </View>
  );
}
