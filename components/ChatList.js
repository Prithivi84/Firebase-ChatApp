import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import ChatItem from "./ChatItem";
import { useRouter } from "expo-router";

export default function ChatList({ users, currentUser }) {
  useEffect(() => {
    console.log(users);
  }, []);

  const router = useRouter();

  return (
    <View className="flex-1 px-2">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={(item) => Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem
            noBorder={index + 1 == users.length}
            router={router}
            item={item}
            index={index}
            currentUser={currentUser}
          />
        )}
      />
    </View>
  );
}
