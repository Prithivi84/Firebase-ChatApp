import { View, Text } from "react-native";
import React from "react";

export default function MessageItem({ message, currentUser }) {
  if (currentUser?.userId == message?.userId) {
    return (
      <View className="flex-row justify-end mb-3 mr-3">
        <View className="p-3 px-4 rounded-2xl bg-slate-100 border-1">
          <Text className="text-slate-500">{message?.text}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <View className="flex-row justify-start mb-3 ml-3">
          <View className="p-3 px-4 rounded-2xl bg-slate-500">
            <Text className="text-white">{message?.text}</Text>
          </View>
        </View>
      </View>
    );
  }
}
