import { View, Text, Platform } from "react-native";
import React, { useRef } from "react";
import image from "../assets/images/icon.png";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Feather from "@expo/vector-icons/Feather";
import Menubar from "./customMenu";
import { useAuth } from "../context/authContext";

const ios = Platform.OS == "ios";
export default function HomeHeader() {
  const { top } = useSafeAreaInsets();
  const { logout, user } = useAuth();
  const handelLogout = async () => {
    await logout();
  };

  //   const ref = useRef();

  const handelProfile = () => {};

  return (
    <View
      style={{ paddingTop: ios ? top : top + 10 }}
      className="flex-row justify-between px-5 bg-indigo-700 pb-4 "
    >
      <View>
        <Text style={{ fontSize: hp(3) }} className="text-white font-medium">
          Chats
        </Text>
      </View>
      <View>
        <Menu>
          <MenuTrigger>
            <Image
              style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
              source={image}
              contentFit="cover"
              transition={500}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 10,
                borderCurve: "continuous",
                marginTop: 40,
                marginRight: 10,
                backgroundColor: "white",
                padding: 5,
                width: 160,
              },
            }}
          >
            <Menubar
              text="Profile"
              action={handelProfile}
              value={null}
              icon={<Feather name="user" size={24} color="black" />}
            />
            <Menubar
              text="LogOut"
              action={handelLogout}
              value={null}
              icon={<Feather name="log-out" size={24} color="black" />}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}
