const router = require("express").Router();
const {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimelinePosts,
    getAllPosts,
    getUserPostsByUsername,
    getUserPostsByUserId,
} = require("../controllers/postController/postController");

// Routes

router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/like/:id", likePost);
router.get("/:id", getPost);
router.get("/timeline/:userId", getTimelinePosts);
router.get("/feed/allposts", getAllPosts);
router.get("/profile/username/:username", getUserPostsByUsername);
router.get("/profile/:id", getUserPostsByUserId);

module.exports = router;
