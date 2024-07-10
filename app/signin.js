import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Feather, Entypo } from "@expo/vector-icons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";

export default function signIn() {
  const [seePassword, setSeePassword] = useState(true);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const { login } = useAuth();

  const handelSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "please fill all the Fields", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    setLoading(true);

    let response = await login(emailRef.current, passwordRef.current);
    setLoading(false);

    console.log("got response", response);
    if (!response.success) {
      const msg = response.msg;
      Alert.alert("Sign In", msg, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);

      console.log("invalid email", typeof response.msg);
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />

      <View
        style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
        className="flex-1 gap-12"
      >
        <View className="items-center">
          <Image
            style={{ height: hp(25) }}
            resizeMode="contain"
            source={require("../assets/images/icon.png")}
          />
        </View>

        <View className="gap-5">
          <Text
            style={{ fontSize: hp(4) }}
            className="font-bold tracking-wider text-center text-neutral-700"
          >
            Sign In
          </Text>

          {/* Inputs Fields */}

          <View className="gap-3">
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-sm"
            >
              <Feather name="mail" size={24} color="black" />
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-600"
                placeholder="Email"
                placeholderTextColor={"gray"}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View className="gap-3">
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-sm"
            >
              <Entypo name="lock" size={24} color="black" />
              <TextInput
                secureTextEntry={seePassword}
                onChangeText={(value) => (passwordRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-600"
                placeholder="Password"
                placeholderTextColor={"gray"}
              />

              <TouchableOpacity
                onPress={() => setSeePassword(!seePassword)}
                className="absolute right-5"
              >
                {seePassword ? (
                  <Entypo name="eye-with-line" size={24} color="black" />
                ) : (
                  <Entypo name="eye" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="">
              <Text className="text-sm text-right font-normal text-neutral-800">
                Forget Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {loading ? (
              <View className="flex-row justify-center">
                <Loading size={hp(8)} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  handelSubmit();
                }}
              >
                <View
                  style={{ height: hp(7) }}
                  className=" bg-[#5783db] items-center justify-center rounded-sm"
                >
                  <Text className="font-semibold text-2xl text-gray-100 ">
                    Login
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-center">
            <Text style={{ fontSize: hp(1.8) }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("signUp")}>
              <Text style={{ fontSize: hp(1.8) }} className="text-blue-700">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
