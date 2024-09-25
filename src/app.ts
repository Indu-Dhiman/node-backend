import express from 'express';
import dotenv from 'dotenv';
import sequelize from "./util/dbConn";
import cors from "cors";
import errorMiddleware from "./middleware/error";
import setInterface from "./middleware/interface";

import userRouter from "./router/user";
import fileRouter from './router/upload';


dotenv.config();
const app = express();
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
app.use("/file", fileRouter);


app.use(errorMiddleware);


app.listen(5000, () => {
  connectToDb();
  console.log(`[*] Server listening on Port ${5000}`);
});