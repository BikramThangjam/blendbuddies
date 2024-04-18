import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();

    const allPosts = await Post.find().sort({ createdAt: -1 });

    res.status(201).json(allPosts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Read
export const getFeedPosts = async (req, res) => {
  try {
    const allPosts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = await Post.find({ userId });
    console.log("userPosts ", userPosts);
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    // { new: true } instruct Mongoose to return the modified document (the document after the update) instead of the original document.
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("postid ", postId);

    const postComments = await Comment.find({ postId })
      .populate({
        path: "userId",
        select: "firstName lastName location picturePath",
      })
      .populate({
        path: "replies.userId",
        select: "firstName lastName location picturePath",
      })
      .sort({ _id: -1 });

    res.status(200).json(postComments);

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    // Extract data from the request body
    const { userId, postId, comment, from } = req.body;
    console.log({ userId, postId, comment, from });
    // Create a new comment instance
    const newComment = new Comment({
      userId,
      postId,
      comment,
      from,
    });

    // Save the new comment to the database
    const savedComment = await newComment.save();

    // If the comment is successfully saved, send a success response
    res.status(201).json(savedComment);
  } catch (error) {
    // If an error occurs while saving the comment, send an error response
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const {id} = req.params; // Assuming the post ID is passed as a route parameter
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPosts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(updatedPosts);
    
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
