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



app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://gourab-authentication.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});





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
 