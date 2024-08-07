import { View, Text, ScrollView } from "react-native";
import React from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, currentUser, scrollViewRef }) {
  // const [mess]

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      ref={scrollViewRef}
      contentContainerStyle={{ paddingTop: 10, width: "100%" }}
    >
      {messages.map((message, index) => {
        return (
          <MessageItem
            message={message}
            key={index}
            currentUser={currentUser}
          />
        );
      })}
    </ScrollView>
  );
}
