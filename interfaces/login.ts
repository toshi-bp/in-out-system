import { Timestamp } from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export type LoginState = "login" | "logout" | "";

export type LoginInfo = {
  state: LoginState;
  userid: string;
  email: string;
};

export type adminLogin = {};
