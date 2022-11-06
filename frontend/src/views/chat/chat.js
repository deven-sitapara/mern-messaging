import React from 'react';
import { makeStyles } from '@mui/styles';
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
    Typography
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { SocketIOContext } from 'context/SocketIOContext';
import { useContext } from 'react';

const useStyles = makeStyles({
    table: {
        minWidth: 650
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

// ==============================|| CHAT PAGE ||============================== //

// const socket = io('http://localhost:3001');
const Chat = () => {

    const classes = useStyles();
    const [messages, setmessages] = useState([]);
    //Socket
    const socket = useContext(SocketIOContext);

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastPong, setLastPong] = useState(null);


    useEffect(() => {

        socket.on('connect', () => {
            setIsConnected(true);
            setmessages([...messages, `You connected with id # ${socket.id}`])
            console.log(`You connected with id # ${socket.id}`);
        });
    
        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        // socket.on('pong', () => {
        //     setLastPong(new Date().toISOString());
        // });

        socket.on('receive-message', (msg) => {
            setmessages([...messages, msg])
            //display message
            // console.log('receive-message', msg);
            socket.emit('receive-message', msg);

        });
    
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, [messages, socket]);

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" className="header-message">
                        Chat
                    </Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        <ListItem button key="RemySharp">
                            <ListItemIcon>
                                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="John Wick"></ListItemText>
                        </ListItem>
                    </List>
                    <Divider />
                    <Grid item xs={12} style={{ padding: '10px' }}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                    </Grid>
                    <Divider />
                    <List>
                        <ListItem button key="RemySharp">
                            <ListItemIcon>
                                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
                            <ListItemText secondary="online" align="right"></ListItemText>
                        </ListItem>
                        <ListItem button key="Alice">
                            <ListItemIcon>
                                <Avatar alt="Alice" src="https://material-ui.com/static/images/avatar/3.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="Alice">Alice</ListItemText>
                        </ListItem>
                        <ListItem button key="CindyBaker">
                            <ListItemIcon>
                                <Avatar alt="Cindy Baker" src="https://material-ui.com/static/images/avatar/2.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <List className={classes.messageArea}>
                        {messages.map((message, index) => (
                            <ListItem key={index}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ListItemText align="right" bottom="0" primary={message}></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        <Formik
                            initialValues={{ chatMessage: '' }}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                const newMessage = values.chatMessage;
                                socket.emit('send-message', newMessage);
                                setmessages([...messages, newMessage])
                                setSubmitting(false);
                            }}
                        >
                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid item xs={11}>
                                        <TextField
                                            onChange={handleChange}
                                            id="chatMessage"
                                            name="chatMessage"
                                            label="Type Something here..."
                                            fullWidth
                                         />
                                    </Grid>
                                    <Grid item xs={1} align="right">
                                        <Fab type="submit" color="primary" aria-label="add">
                                            <Send />
                                        </Fab>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default Chat;
