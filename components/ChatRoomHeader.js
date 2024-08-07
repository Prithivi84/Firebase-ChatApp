import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
// import { useRouter } from 'expo-router'
// import { Stack } from 'expo-router'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import image from "../assets/images/icon.png";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";

export default function ChatRoomHeader({ user, router }) {
  return (
    <View className="flex-row items-center justify-between  pt-16 pb-6 px-8 bg-slate-500 rounded-b-3xl ">
      <View className="flex-row items-center gap-4 ">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <Image
          style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
          source={image}
          contentFit="cover"
          transition={500}
        />
        <Text className="font-semibold text-2xl text-white">
          {user?.username}
        </Text>
      </View>
      <View className="flex-row gap-4">
        <Feather name="phone" size={24} color="white" />
        <Feather name="video" size={24} color="white" />
      </View>
    </View>
  );
}
