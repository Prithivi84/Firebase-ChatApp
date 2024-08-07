import { View, Text } from "react-native";
import React from "react";
import { MenuOption } from "react-native-popup-menu";

export default function Menubar({ text, action, value, icon }) {
  return (
    <MenuOption onSelect={() => action(value)}>
      <View className="px-4 flex-row justify-between py-2 items-center">
        <Text className="font-medium">{text}</Text>
        {icon}
      </View>
    </MenuOption>
  );
}
