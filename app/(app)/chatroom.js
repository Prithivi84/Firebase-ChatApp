import { View, Text, TextInput, Pressable, ToastAndroid } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ChatRoomHeader from "../../components/ChatRoomHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageList from "../../components/MessageList";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getRoomId } from "../../context/common";
import { useAuth } from "../../context/authContext";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db, roomRef } from "../../firebase";

export default function chatroom() {
  const item = useLocalSearchParams();
  console.log("chatroom", item);
  const { user } = useAuth();

  const [text, setText] = useState("");

  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    createRoomIfNotExists();

    roomMessages();
    updateScrollView();
  }, []);

  const roomMessages = async () => {
    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "room", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    // console.log("message of q", q);

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      console.log("chatroom", allMessages[0]);
      setMessages([...allMessages]);
    });
    return unsub;
  };

  const createRoomIfNotExists = async () => {
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      // const q = query(roomRef, where("roomId", "==", roomId));
      // const querySnapshot = await getDocs(q);

      // console.log("snap", querySnapshot);
      // if (!querySnapshot) {
      await setDoc(doc(db, "room", roomId), {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
      });
      // }
    } catch (e) {
      console.log(e);
    }
  };

  //  const q = query(usersRef, where("userId", "!=", user?.uid));

  //       const querySnapshot = await getDocs(q);
  //       let data = [];
  //       querySnapshot.forEach((doc) => {
  //         data.push({ ...doc.data() });
  //       });
  //       console.log("got users:", data);

  const handleSendMessage = async () => {
    if (text != "");
    {
      let message = text;
      setText("");
      if (!message) return;
      try {
        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(db, "room", roomId);
        const messagesRef = collection(docRef, "messages");
        const newDoc = await addDoc(messagesRef, {
          userId: user?.userId,
          text: message,
          senderName: user?.username,
          createdAt: Timestamp.fromDate(new Date()),
        });
        updateScrollView();
        console.log("messages", newDoc.id);
      } catch (e) {
        ToastAndroid.show(e, ToastAndroid.LONG);
      }
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const router = useRouter();

  console.log("messages", messages);

  return (
    <View className="flex-1 bg-white">
      <ChatRoomHeader user={item} router={router} />
      <View className="flex-1 p-4">
        <MessageList
          messages={messages}
          scrollViewRef={scrollViewRef}
          currentUser={user}
        />
      </View>
      <View style={{ marginBottom: hp(1.7) }} className="pt-2">
        <View className="flex-row gap-4 w-full px-4">
          <View className="flex-row justify-between w-4/5 rounded-lg bg-white border p-3 border-neutral-300  ">
            <TextInput
              value={text}
              onTouchStart={updateScrollView}
              maxLength={500}
              onChangeText={(value) => setText(value)}
              placeholder="Type Message..."
              className="w-full"
            />
          </View>
          <Pressable
            onPress={handleSendMessage}
            className="bg-slate-900 w-20 overflow-hidden rounded-lg justify-center items-center"
          >
            <MaterialCommunityIcons name="send" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
