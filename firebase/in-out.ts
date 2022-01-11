import { User } from "../interfaces/login";
import { hall, place } from "../interfaces/places";
import {
  setDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  Timestamp,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";
import { history, userStatus } from "../interfaces/userStatus";

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
    console.log(selectedPlace);
    // 場所が見つかる→true, 見つからない→false
    if (selectedPlace && selectedPlace.roomName !== "廊下") {
      console.log("not 廊下");
      await toInside(selectedPlace, currentUser);
      return;
    } else {
      return [currentUserStatus, hall];
    }
  } else {
    return [currentUserStatus, hall];
  }
};

export const exit = async (
  currentUser: User | null | undefined,
  history: history
) => {
  await toOutside(history, currentUser);
};

const getPlace = async (
  password: string,
  currentUser: User | null | undefined
): Promise<place | undefined> => {
  if (currentUser) {
    let selectedPlace: place = hall;
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
    return hall;
  }
};

const toInside = async (selectedPlace: place, currentUser: User) => {
  // 入場→mapに新たなデータを追加する
  const userId = currentUser.uid;
  const userStatus: userStatus = "inside";
  if (userId) {
    await setDoc(
      doc(db, "users", userId),
      {
        history: arrayUnion({
          inTime: Timestamp.now(),
          outTime: "",
          place: selectedPlace.roomName,
          status: userStatus,
        }),
      },
      { merge: true }
    );
  }
  return;
};

const toOutside = async (
  history: history,
  currentUser: User | null | undefined
) => {
  // 退場→mapの一番下のインデックスのoutTimeのみ更新
  // 配列を読み込んで代入した値を書き込む方式にする
  const userStatus: userStatus = "outside";
  const userId = currentUser?.uid;
  history[history.length - 1].outTime = Timestamp.now();
  history[history.length - 1].status = "outside";
  console.log(history);
  if (userId) {
    await setDoc(
      doc(db, "users", userId),
      {
        history: history,
      },
      { merge: true }
    );
  }
};
