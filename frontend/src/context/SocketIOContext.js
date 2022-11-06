import { createContext } from 'react';

import { io } from 'socket.io-client';
const socket = io('http://localhost:3001');

export const SocketIOContext = createContext(socket);
