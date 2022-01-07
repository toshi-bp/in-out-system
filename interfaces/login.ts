import { Timestamp } from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export type LoginState = "login" | "logout" | "";

export type User = {
  displayName: string | null | undefined;
  email: string | null | undefined;
};

export type adminLogin = {};
