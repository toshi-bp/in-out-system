import type { NextPage } from "next";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import Router from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import firebaseApp from "../firebase/firebase";

const Login: NextPage = () => {
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    currentUser && Router.push("/user");
  }, [currentUser]);
  console.log(currentUser);
  const login = () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };
  return (
    <div>
      <h1>ログインページ</h1>
      <Button variant="contained" onClick={login}>
        googleでログイン
      </Button>
    </div>
  );
};

export default Login;
