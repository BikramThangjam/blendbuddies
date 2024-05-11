import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";
import { sendMessage, getMessages, getConversations } from "../controllers/message.js";

// File storage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "tempAssets");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage,
    limits: {
    fileSize: 50 * 1024 * 1024 // 50MB 
    }
})

const router = express.Router();

router.get("/conversations",verifyToken, getConversations)
router.get("/:otherUserId",verifyToken, getMessages);
router.post("/",verifyToken, upload.single("image"), sendMessage);


export default router;