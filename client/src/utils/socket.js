import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_LINK;

export const socket = io(URL);