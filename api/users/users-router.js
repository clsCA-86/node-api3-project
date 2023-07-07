const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");
const router = express.Router();

router.get("/", async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const allUsers = await Users.get();
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ message: "cannot retrieve users" });
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post("/", validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid

  Users.insert(req.body)
    .then((user) => res.status(201).json(user))
    .catch(() => res.status(500).json({ message: "user was not added" }));
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid

  Users.update(req.params.id, req.body)
    .then((user) => res.status(200).json(user))
    .catch(() => res.status(500).json({ message: "user was not updated" }));
});

router.delete("/:id", validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const deletedUser = await Users.getById(req.params.id);
  try {
    await Users.remove(req.params.id);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: "could not delete user" });
  }
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const allPosts = await Users.getUserPosts(req.params.id);
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json({ message: "could not find users posts" });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const newPost = await Posts.insert({
      user_id: req.params.id,
      text: req.text,
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "could not add new post" });
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Something bad happened inside the hubs router",
  });
});

// do not forget to export the router
module.exports = { router };
