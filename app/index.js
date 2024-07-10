import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

export default function StartPage() {
  return (
    <View className="flex-1 justify-center items-center">
      {/* <Text className="text-3xl text-center">index</Text> */}
      <ActivityIndicator size={"large"} color="gray" />
    </View>
  );
}
