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
  CircularProgress,
} from "@material-ui/core";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import firebaseApp from "../firebase/firebase";

const Login: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    currentUser && Router.push("/user");
  }, [currentUser]);
  console.log(currentUser);
  const login = () => {
    setLoading(true);
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };
  return (
    <div>
      <Container>
        {!loading && (
          <div>
            <h1>入退場管理システム</h1>
            <h2>ログインページ</h2>
            <Button variant="contained" onClick={login}>
              googleでログイン
            </Button>
          </div>
        )}
        {loading && <CircularProgress />}
      </Container>
    </div>
  );
};

export default Login;
