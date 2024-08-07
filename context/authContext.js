import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  signInWithCredential,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session/build/providers/Google";

import Constants from "expo-constants";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  // const EXPO_REDIRECT_PARAMS = {
  //   useProxy: true,
  //   projectNameForProxy: "@prithivisharma/Firebase_Chat",
  // };
  // const NATIVE_REDIRECT_PARAMS = { native: "Firebase_Chat://" };
  // const REDIRECT_PARAMS =
  //   Constants.appOwnership === "expo"
  //     ? EXPO_REDIRECT_PARAMS
  //     : NATIVE_REDIRECT_PARAMS;
  // const redirectUri = makeRedirectUri(REDIRECT_PARAMS);

  // const [request, res, GoogleLogin] = useAuthRequest({
  //   clientId:
  //     "25770216044-ksjb9ts2f9i271tgd6adf8ag540ht6t1.apps.googleusercontent.com",
  // });

  useEffect(() => {
    // setTimeout(() => {
    //   setIsAuthenticated(false);
    // }, 3000);

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  // useEffect(() => {

  // },[res])

  const updateUserData = async (userId) => {
    const docRef = doc(db, "user", userId);

    console.log("docRef", docRef);

    const docSnap = await getDoc(docRef);
    console.log("docSnap", docSnap);

    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        username: data.username,
        profileUrl: data.profileUrl,
        userId: data.userId,
      });
    }
  };

  // useEffect(() => {
  //   // if (res?.type == "success") {
  //   //   const { id_token } = res.params;
  //   //   const credential = GoogleAuthProvider.credential(id_token);
  //   //   signInWithCredential(auth, credential);
  //   // }

  //   GoogleSignin.configure({
  //     scopes: ["email"], // what API you want to access on behalf of the user, default is email and profile
  //     webClientId:
  //       "25770216044-ksjb9ts2f9i271tgd6adf8ag540ht6t1.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
  //     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //   });
  // }, []);

  const GoogleLogin = async () => {
    // if (res?.type == "success") {
    //   const { id_token } = res.params;
    //   const credential = GoogleAuthProvider.credential(id_token);
    //   await signInWithCredential(auth, credential);
    // }
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const { accessToken, idToken } = await GoogleSignin.signIn();
    //   setloggedIn(true);
    //   const credential = auth.GoogleAuthProvider.credential(
    //     idToken,
    //     accessToken
    //   );
    //   await signInWithCredential(auth, credential);
    // } catch (error) {
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     // user cancelled the login flow
    //     alert("Cancel");
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //     alert("Signin in progress");
    //     // operation (f.e. sign in) is in progress already
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     alert("PLAY_SERVICES_NOT_AVAILABLE");
    //     // play services not available or outdated
    //   } else {
    //     // some other error happened
    //   }
    // }
  };

  const login = async (email, password) => {
    let res;
    await signInWithEmailAndPassword(auth, email, password)
      .then((v) => {
        res = { success: true };
      })
      .catch((e) => {
        if (e.message.includes("(auth/invalid-email)")) {
          res = { success: false, msg: "Invalid Email" };
        } else {
          res = { success: false, msg: e.message };
        }
      });
    return res;
  };
  const logout = async () => {
    let res;
    await signOut(auth)
      .then((e) => {
        // console.log(e);
        res = { success: true };
      })
      .catch((e) => {
        res = { success: false, msg: e.message, error: e };
      });
    return res;
  };
  const register = async (email, password, username, profileUrl) => {
    let res;

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const response = userCredential.user;
        console.log("user", response);

        setDoc(doc(db, "user", response.uid), {
          username,
          profileUrl,
          userId: response.uid,
        });

        res = { success: true, data: response };
        // const userData = createUser(email, user.uid);

        // console.log(userData);
        // dispatch(
        //   authenticate({ token: user.stsTokenManager.accessToken, userData })
        // );

        // navigation.navigate("Login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(typeof errorMessage);

        if (errorMessage.includes("(auth/invalid-email)")) {
          res = { success: false, msg: "Invalid Email" };
        } else {
          res = { success: false, msg: errorMessage };
        }
      });
    return res;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register, GoogleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }

  return value;
};
