import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider, AuthContext } from "../context/authContext";
import { useContext } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  // const { currentUser } = useContext(AuthContext);
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
