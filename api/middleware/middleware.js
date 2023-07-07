const morgan = require("morgan");
const User = require("../users/users-model");
function logger(req, res, next) {
  // DO YOUR MAGIC
  const date = new Date();
  console.log(
    `You made a ${req.method} request\n${date}\nhttp://${req.hostname}`
  );
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await User.getById(req.params.id);
    if (user) {
      req.user = user;
      next();
    } else {
      // res.status(404).json({ message: "user not found" });
      next({ status: 404, message: "user not found" });
    }
  } catch (err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (name && typeof name === "string" && name.trim().length) {
    next();
  } else {
    // res.status(400).json({ message: "missing required name field" });
    next({ status: 400, message: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if (text && typeof text === "string" && text.trim().length) {
    req.text = text;
    next();
  } else {
    // res.status(400).json({ message: "missing required text field" });
    next({ status: 400, message: "missing required text field" });
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
