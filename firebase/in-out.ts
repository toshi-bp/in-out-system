import { User } from "../interfaces/login";
import { place } from "../interfaces/places";
import {
  setDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { userStatus } from "../interfaces/userStatus";

export const entrance = async (
  password: string,
  currentUser: User | null | undefined,
  currentUserStatus: userStatus
) => {
  /**
   * 入場処理を行う関数
   * 1. パスワードから該当する部屋を検索
   * 2. 入場処理を行うか否かを判定
   * 3. 入場した場合, 部屋情報と時間をfirestoreに書き込む
   */
  if (currentUser) {
    const selectedPlace: place | undefined = await getPlace(
      password,
      currentUser
    );
    // 場所が見つかる→true, 見つからない→false
    if (selectedPlace) {
      addHistory(currentUserStatus, currentUser?.displayName);
      return selectedPlace;
    } else {
      return false;
    }
  }
};
const getPlace = async (
  password: string,
  currentUser: User | null | undefined
): Promise<place | undefined> => {
  if (currentUser) {
    let selectedPlace: place = {
      buildingName: "",
      floor: 0,
      roomName: "",
      password: "",
    };
    console.log("user is not null");
    const q = query(
      collection(db, "places"),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach((doc) => {
      selectedPlace = doc.data() as place;
      console.log(selectedPlace);
    });
    console.log(selectedPlace);
    return selectedPlace;
  } else {
    console.log("user is null or undefined");
  }
};

const addHistory = (
  currentUserStatus: userStatus,
  usename: string | null | undefined
) => {
  if (currentUserStatus === "outside") {
    toInside();
  } else {
    toOutside();
  }
};

const toInside = () => {
  // 入場→mapに新たなデータを追加する
};

const toOutside = () => {
  // 退場→mapの一番下のインデックスの
};
