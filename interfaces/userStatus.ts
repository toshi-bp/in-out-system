import { Timestamp } from "firebase/firestore";
import { place } from "./places";

// ユーザーの現在の状態を示す
export type userStatus = "inside" | "outside";
/**
 * ユーザーデータに持たせておきたいもの
 * 1. ユーザー名
 * 2. ユーザーが回った場所
 * 3. 現在地
 * 4. ユーザーが出入りした場所の時間
 */

export type history = {
  place: string;
  status: userStatus;
  inTime: Timestamp;
  outTime: Timestamp | "";
}[];

export type currentUserStatus = {
  username: string;
  placeHistory: history;
};
