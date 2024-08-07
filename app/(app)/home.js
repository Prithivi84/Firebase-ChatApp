import { View, Text, Button, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import HomeHeader from "../../components/HomeHeader";
import { StatusBar } from "expo-status-bar";
import ChatList from "../../components/ChatList";
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebase";

export default function home() {
  const { logout, user } = useAuth();

  const [users, setUsers] = useState([]);

  const handelLogout = async () => {
    await logout();
  };

  useEffect(() => {
    console.log(user?.uid);
    if (user?.uid) {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    if (user?.uid) {
      try {
        const q = query(usersRef, where("userId", "!=", user?.uid));

        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data() });
        });
        console.log("got users:", data);
        setUsers(data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  console.log("home", user);

  return (
    <View className="h-full bg-slate-200">
      <StatusBar style="light" />
      <HomeHeader />
      {/* <Button title="Sign Out" onPress={handelLogout}></Button> */}
      {users.length > 0 ? (
        <ChatList currentUser={user} users={users} />
      ) : (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
