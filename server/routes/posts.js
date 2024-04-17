import express from "express";
import {getComments, getFeedPosts, getUserPosts, likePost, addComment} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);
router.get("/:postId/comments", verifyToken, getComments);
router.post("/addComment", verifyToken, addComment)

export default router;