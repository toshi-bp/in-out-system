// 場所データの型
export type place = {
  buildingName: string;
  floor: number;
  roomName: string;
  password: string;
};

export const hall: place = {
  buildingName: "",
  floor: 0,
  roomName: "廊下",
  password: "",
};
