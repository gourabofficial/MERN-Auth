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


const allowedOrigins = [
  "http://localhost:5173",
  "https://gourab-authentication.onrender.com " 
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming request from origin:", origin); // Log the origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());

// debug
app.use((req, res, next) => {
  console.log(`Incoming request from: ${req.headers.origin}`);
  next();
});

//API Endpoints

app.get("/", (req, res) => {
  res.send("Hare Krishna");
});



app.use('/api/auth', authRouts);
app.use('/api/user',userRouter);




app.listen(PORT, () => console.log(`Server Started !! ${PORT}`));
 