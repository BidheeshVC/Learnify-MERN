// controllers/postController/postController.js

const Post = require("../../models/Post");
const User = require("../../models/User");

// CREATE POST
// const createPost = async (req, res) => {
//     console.log("request body: ", req.body);
//     const newPost = new Post(req.body);
//     try {
//         const savedPost = await newPost.save();
//         res.status(200).json(savedPost);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

const createPost = async (req, res) => {
    console.log("request body: ", req.body);
    const newPost = new Post({
        ...req.body,
        tags: req.body.tags || [], // Default empty array if no tags
        emojis: req.body.emojis || [], // Default empty array if no emojis
        location: req.body.location || { lat: 0, long: 0 }, // Default location if not provided
    });

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
};


// UPDATE POST
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("The post has been updated");
        } else {
            res.status(403).json("You can update only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE POST
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted");
        } else {
            res.status(403).json("You can delete only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// LIKE/DISLIKE POST
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET SINGLE POST
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET TIMELINE POSTS
const getTimelinePosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) =>
                Post.find({ userId: friendId })
            )
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET ALL POSTS (FEED)
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Sort by newest first
        // const posts = await Post.find();
        const postsWithUserDetails = await Promise.all(
            posts.map(async (post) => {
                const user = await User.findById(post.userId);
                return {
                    ...post._doc,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    coverPicture: user.coverPicture,
                };
            })
        );
        res.status(200).json(postsWithUserDetails);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET USER POSTS BY USERNAME
const getUserPostsByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET USER POSTS BY USER ID
const getUserPostsByUserId = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

// REPORT POST
const reportPost = async (req, res) =>{
    try {
        res.status(200);
    } catch (error) {
       console.log("error in report post", error.message) 
    }
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimelinePosts,
    getAllPosts,
    getUserPostsByUsername,
    getUserPostsByUserId,
};

