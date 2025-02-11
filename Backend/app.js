import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config"; 
import connectDB from "./config/mongodb.js";
import authRouts from './routs/authRouts.js';
import userRouter from "./routs/userRouts.js";

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(cookieParser());

//API Endpoints

app.get("/", (req, res) => {
  res.send("Hari Bol")
})

app.use('/api/auth', authRouts);
app.use('/api/user',userRouter);




app.listen(PORT, () => console.log(`Server Started !! ${PORT}`));
 