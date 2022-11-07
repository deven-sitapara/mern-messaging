import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Divider,
  Fab,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { SocketIOContext } from "context/SocketIOContext";
import { useContext } from "react";
import MainCard from "ui-component/cards/MainCard";
import SecondaryAction from "ui-component/cards/CardSecondaryAction";
import { gridSpacing } from "store/constant";
import { useAuthContext } from "hooks/useAuthContext";
import { bgcolor, Box } from "@mui/system";
import ChatFooter from "./chatFooter";

const useStyles = makeStyles({
  //   table: {
  //     minWidth: 650,
  //   },
  //   chatSection: {
  //     // width: "100%",
  //     height: "80vh",
  //   },
  //   headBG: {
  //     backgroundColor: "#e0e0e0",
  //   },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

// ==============================|| CHAT PAGE ||============================== //

// const socket = io('http://localhost:3001');
const Chat = () => {
  const classes = useStyles();
  const [messages, setmessages] = useState([]);
  const [messageText, setmessageText] = useState("");
  //Socket
  const socket = useContext(SocketIOContext);
  const { user } = useAuthContext(SocketIOContext);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const textboxRef = useRef(null);

  useEffect(() => {
    //console.log(user);
    socket.on("connect", () => {
      setIsConnected(true);
      setmessages([
        ...messages,
        { sender_id: "me", text: `You connected with id # ${socket.id}` },
      ]);
      console.log(`You connected with id # ${socket.id}`);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // socket.on('pong', () => {
    //     setLastPong(new Date().toISOString());
    // });

    socket.on("receive-message", (msg) => {
      setmessages([...messages, msg.text]);
      console.log("msg");
      console.log(msg);
      console.log("sender");
      console.log("socket.id", msg.sender_id);
      //display message
      // console.log('receive-message', msg);
      console.log("messages", messages);
      socket.emit("receive-message", msg);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, [messages, socket]);

  return (
    <MainCard
      title="Chat"
      secondary={
        <SecondaryAction link="https://next.material-ui.com/system/typography/" />
      }
    >
      <Grid
        container
        spacing={gridSpacing}
        component={Paper}
        className={classes.chatSection}
      >
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon sx={{ pr: 1 }}>
                <Avatar
                  alt={user.user.email}
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary={user.user.email}></ListItemText>
            </ListItem>
          </List>
          <Divider />
        </Grid>
        <Grid item xs={9}>
          <List className={classes.messageArea}>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    {message.sender_id === socket.id ? (
                      <ListItemText
                        align="right"
                        sx={{
                          padding: "10px",
                          backgroundColor: "#f8e896",
                          borderRadius: "10px",
                        }}
                        bottom="0"
                        primary={message.text}
                      ></ListItemText>
                    ) : (
                      <ListItemText
                        align="left"
                        sx={{ padding: "10px" }}
                        bottom="0"
                        primary={message.text}
                      ></ListItemText>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Grid container style={{ paddingTop: "10px" }}>

          <ChatFooter socket={socket} handleSubmit={(values, { setSubmitting, resetForm }) => {
                const newMessage = values.chatMessage;
                socket.emit("send-message", {
                  sender_id: socket.id,
                  text: newMessage,
                });
                setmessages([
                  ...messages,
                  { sender_id: socket.id, text: newMessage },
                ]);
                setSubmitting(false);
              }} />
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Chat;
