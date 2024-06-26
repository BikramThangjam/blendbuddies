import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import messageRoutes from './routes/message.js';
import { verifyToken } from "./middleware/auth.js";
import { updateProfile } from "./controllers/users.js";
import {app, server} from "./socket/socket.js"

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();

const corsOptions = {
    origin: ['http://localhost:5173', 'https://blendbuddies.netlify.app'],
    credentials: true
};

app.use(express.json());

app.use(cors(corsOptions));
app.options('*', cors());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("combined")); // logger
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// File storage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "tempAssets");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

// Routes with uploaded files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.patch("/user/profile/:id", verifyToken, upload.single("picture"), updateProfile);
// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/messages", messageRoutes);


// Mongoose setup
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    server.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));

}).catch(error => console.log(`Could not connect to db. Error- ${error}`))