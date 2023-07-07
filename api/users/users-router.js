const express = require('express');
const User = require('./users-model')
const Post = require('../posts/posts-model')

const { validatePost, validateUser, validateUserId } = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  User.get().
  then((users) => {
    res.json(users)
  })
});
  // RETURN AN ARRAY WITH ALL THE USERS

router.get('/:id', validateUserId, (req, res) => {
  res.send(req.user)
});

router.post('/', validateUser, (req, res) => {
  User.insert(req.user).
  then((user) =>
    res.json(user)
  )
});

router.put('/:id', validateUserId, validateUser, (req, res) => {

  User.update(req.params.id, req.user).
  then((user) => {
    res.json(user)
  })
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id).
  then(() => {
    res.json(req.user)
  })
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, (req, res) => {
  User.getUserPosts(req.params.id).
  then((posts) => {
    res.json(posts)
  })
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const newPost = {user_id: req.params.id, text: req.text,}
  const post = await Post.insert(newPost)
  res.send(post)
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message
  }) ;
});

// do not forget to export the router
module.exports = router