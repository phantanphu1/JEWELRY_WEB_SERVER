import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import http from 'http';
import routes from './routes';
import mongoose from 'mongoose';
import morgan from 'morgan';

const app = express();

const swaggerUi = require("swagger-ui-express");
const documentation = require('./common/swagger/rule.json')
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(documentation));

app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("common"));

dotenv.config();


const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_CONNECT_DATABASE + "");

const database = mongoose.connection;

database.on("err", (err: any) => {
  console.log(err);
  console.log("lỗi");
  
});

database.once("connected", () => {
  console.log("Database Connect successfully...");
});

app.use("/api", routes());

const PORT = process.env.PORT || 5000;

server.listen(PORT, function () {
  console.log(`Server is running port ${PORT}...`);
});

