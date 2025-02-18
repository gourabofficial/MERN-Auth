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
  process.env.FRONTEND_URL,  
  "http://localhost:5173",
  "https://gourab-authentication.onrender.com"
];

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming request from origin:", origin); // Log the origin
    // Allow requests with no origin (e.g., same-origin requests)
    if (!origin) {
      callback(null, true);
      return;
    }
    // Allow requests from allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());

//API Endpoints

app.get("/", (req, res) => {
  res.send("Hare Krishna");
});

app.use('/api/auth', authRouts);
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Server Started !! ${PORT}`));