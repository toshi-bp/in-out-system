import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  Box,
  Button,
  Container,
  FormControl,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@material-ui/core";
import { logout } from "../../firebase/auth";
import { history, userStatus } from "../../interfaces/userStatus";
import { hall, place } from "../../interfaces/places";
import { entrance, exit } from "../../firebase/in-out";
import { collection, query, setDoc, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
// import entranceModal from "../../components/entranceModal";

const UserHome: NextPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [currentPlace, setCurrentPlace] = useState<string>("廊下");
  const [currentUserStatus, setCurrentUserStatus] =
    useState<userStatus>("outside");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [history, setHistory] = useState<history>([]);
  console.log("user:", currentUser);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleHistoryModal = () => {
    setShowHistoryModal(!showHistoryModal);
  };

  const switchSide = async () => {
    console.log(currentUserStatus);
    if (currentUserStatus === "outside") {
      let h: history = [];
      const q = query(
        collection(db, "users"),
        where("displayName", "==", currentUser?.displayName)
      );
      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const d = doc.data();
        h = d.history;
        console.log(d);
        console.log(h);
        setHistory(h);
      });
      await setCurrentUserStatus("inside");
      await setCurrentPlace(h[h.length - 1].place);
    } else {
      setCurrentUserStatus("outside");
      setCurrentPlace(hall.roomName);
    }
  };

  const showHistory = () => {
    console.log(history);
    setShowHistoryModal(true);
    return (
      <Dialog open={showHistoryModal} onClose={handleHistoryModal}>
        <DialogTitle>行動履歴</DialogTitle>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>行動履歴</TableCell>
                <TableCell align="right">場所</TableCell>
                <TableCell align="right">入場時間</TableCell>
                <TableCell align="right">退場時間</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h) => {
                <TableRow>
                  <TableCell>{h.place}</TableCell>
                  <TableCell>{h.inTime}</TableCell>
                  <TableCell>{h.outTime}</TableCell>
                </TableRow>;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    );
  };

  useEffect(() => {
    const getHistory = async () => {
      let h: history = [];
      const q = query(
        collection(db, "users"),
        where("displayName", "==", currentUser?.displayName)
      );
      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const d = doc.data();
        h = d.history;
        console.log(d);
        console.log(h);
        setHistory(h);
      });
    };
    getHistory();
  }, []);
  return (
    <div>
      <Head>
        <title>入出場管理システム</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <h2>{currentUser?.displayName}のマイページ</h2>
        <h3>現在地:{currentPlace}</h3>
        <Box sx={{ mb: 2 }}>
          {currentUserStatus === "outside" && (
            <div>
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                variant="contained"
              >
                入場
              </Button>
              <Dialog open={showModal} onClose={handleModal}>
                <DialogTitle>入場</DialogTitle>
                <FormControl>
                  <DialogContent>
                    <DialogContentText>
                      部屋のパスワードを入力してください
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="standard-basic"
                      label="password"
                      fullWidth
                      variant="standard"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        await entrance(
                          password,
                          currentUser,
                          currentUserStatus
                        );
                        await switchSide();
                        await handleModal();
                      }}
                    >
                      部屋に入る
                    </Button>
                    <Button variant="contained" onClick={handleModal}>
                      閉じる
                    </Button>
                  </DialogActions>
                </FormControl>
              </Dialog>
            </div>
          )}
          {currentUserStatus === "inside" && (
            <Button
              onClick={async () => {
                await exit(currentUser, history);
                await switchSide();
              }}
              variant="contained"
            >
              退場
            </Button>
          )}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setShowHistoryModal(true);
            }}
          >
            行動履歴
          </Button>
          <Dialog open={showHistoryModal} onClose={handleHistoryModal}>
            <DialogTitle>行動履歴</DialogTitle>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>行動履歴</TableCell>
                    <TableCell align="right">場所</TableCell>
                    <TableCell align="right">入場時間</TableCell>
                    <TableCell align="right">退場時間</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((h) => {
                    <TableRow key={h.place}>
                      <TableCell component="th" scope="row">
                        {h.place}
                      </TableCell>
                      <TableCell>{h.inTime}</TableCell>
                      <TableCell>{h.outTime}</TableCell>
                    </TableRow>;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Dialog>
        </Box>
        <Button onClick={logout} variant="contained">
          ログアウト
        </Button>
      </Container>
    </div>
  );
};

export default UserHome;
