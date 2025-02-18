import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config"; 
import connectDB from "./config/mongodb.js";
import authRouts from './routs/authRouts.js';
import userRouter from "./routs/userRouts.js";

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();


const allowedOrigins = [
  process.env.FRONTEND_URL,  
  "http://localhost:5173",
  "https://gourab-authentication.onrender.com"
];

// Log incoming request headers
app.use((req, res, next) => {
  if (req.headers.origin) {
    console.log(`Incoming API request from: ${req.headers.origin}`);
  } else {
    console.log(`Direct browser request detected (No Origin)`);
  }
  next();
});







// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming request from origin:", origin || "Direct browser visit (No Origin)"); 

    // Allow requests with no origin (e.g., same-origin requests, browser navigation)
    if (!origin) {
      return callback(null, true);
    }

    // Allow requests from allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Reject all other origins
    return callback(new Error('Not allowed by CORS'));
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
 