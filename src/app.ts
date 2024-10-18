import express from 'express';
import dotenv from 'dotenv';
import sequelize from "./util/dbConn";
import cors from "cors";
import http from 'http';
import { Server } from "socket.io"; 
import errorMiddleware from "./middleware/error";
import setInterface from "./middleware/interface";
import typeValidationMiddleware from './middleware/typeValidation';
import logging from "./middleware/logging";
import userRouter from "./router/user";
import chatRouter from "./router/chat";
import fileRouter from './router/upload';
import getMenuLits from './router/menulist';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json({ limit: '2450mb' }));
app.use(express.urlencoded({ extended: false }));

var corsOptions = {
  origin: function (origin: any, callback: any) {
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(setInterface);

const connectToDb = async () => {
  const data = await sequelize.sync({ force: false })
  try {
    await sequelize.authenticate();
    console.log("Database Connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/file", fileRouter);
app.use("/", getMenuLits);
app.use(logging);

app.use(errorMiddleware);
app.use(typeValidationMiddleware);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', ({ userId, role }) => {
    console.log(`${userId} (${role}) joined the chat`);
    socket.join(userId);
  });

  socket.on('sendMessage', ({ message, senderId, receiverId }) => {
    io.to(receiverId).emit('receiveMessage', { message, senderId, receiverId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  connectToDb();
  console.log(`[*] Server listening on Port ${5000}`);
});
