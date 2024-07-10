import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "../../context/authContext";

export default function home() {
  const { logout, user } = useAuth();
  const handelLogout = async () => {
    await logout();
  };

  console.log("home", user);

  return (
    <View>
      <Text>home</Text>
      <Button title="Sign Out" onPress={handelLogout}></Button>
    </View>
  );
}
