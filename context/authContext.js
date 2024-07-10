import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

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
          res = { success: false, msg: errorMessage };
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
      value={{ user, isAuthenticated, login, logout, register }}
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
