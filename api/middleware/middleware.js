const User = require('../users/users-model')

function logger(req, res, next) {
  console.log(req.method)
  console.log(req.url)
  console.log(req.time)
  next()
}

async function validateUserId(req, res, next) {
  const user = await User.getById(req.params.id) 
  if (user) {
    req.user = user
    next()
  } else {
    next({ status:404, message:"user not found"})
  }

}

function validateUser(req, res, next) {
  const newUser = req.body
  if ( newUser.name ) {
    req.user = newUser
    next()
  } else {
    next({ status:400, message:"missing required name field"})
  }
}

function validatePost(req, res, next) {
  const newPost = req.body
  if ( newPost.text ) {
    req.text = newPost.text
    next()
  } else {
    next({ status:400, message:"missing required text field"})
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUser,
  validatePost,
  validateUserId
}