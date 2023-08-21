const checkName = (req, res, next) => {
  if (!req.body.username || req.body.username.includes(" ")) {
    res
      .status(400)
      .json({ error: "Username is required and should not contain spaces" });
  } else {
    next();
  }
};

const checkPassword = (req, res, next) => {
  if (!req.body.password_hash || req.body.password_hash.length < 6) {
    res
      .status(400)
      .json({
        error: "Password is required and should be at least 6 characters long",
      });
  } else {
    next();
  }
};

module.exports = { checkName, checkPassword };
