import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Image } from "expo-image";
import image from "../assets/images/icon.png";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { getRoomId } from "../context/common";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { db } from "../firebase";

export default function ChatItem({ item, index, noBorder, currentUser }) {
  const { user } = useAuth;
  const [lastMessage, setLastMessage] = useState(undefined);

  useEffect(() => {
    console.log("chatItem item", item);
    console.log("currentUser", currentUser);
    roomMessages();
  }, []);

  const roomMessages = async () => {
    let roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(db, "room", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    // console.log("message of q", q);

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      console.log("ChatItem message", allMessages);
      setLastMessage(allMessages[0] ? allMessages[0] : null);
      // renderLastMessage();
    });
    return unsub;
  };

  const renderTime = () => {
    console.log(lastMessage?.createdAt);
    return "Time";
  };

  const renderLastMessage = () => {
    // console.log("last message", lastMessage);
    if (typeof lastMessage == "undefined") return "Loading...";
    if (lastMessage) {
      if (currentUser?.userId == lastMessage?.userId)
        return "You: " + lastMessage?.text;
      return lastMessage?.text;
    } else {
      return "Say Hi 👋";
    }
    // return "Say Hi 👋";
  };

  const chatroom = () => {
    router.push({ pathname: "/chatroom", params: item });
  };

  return (
    <Pressable
      onPress={chatroom}
      className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 px-3 ${
        noBorder ? "" : "border-b border-b-neutral-400"
      }`}
    >
      <Image
        style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
        source={image}
        contentFit="cover"
        transition={500}
      />
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-700"
          >
            {item?.username}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
        >
          {renderLastMessage()}
        </Text>
      </View>
    </Pressable>
  );
}
