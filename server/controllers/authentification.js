const jwt = require("jwt-simple");

const User = require("../models/user");
const config = require("../config");

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.SECRET_KEY);
};

/**
 * [signup description]
 * @param  {Object}   req  [request object]
 * @param  {Object}   res  [response object]
 * @param  {Function} next [handles errors]
 * @return {Object}        [token]
 */
module.exports.signup = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(422).send("Please enter email and password");

  User.findOne({ email }, (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) return res.status(422).send("Email in use");

    const user = new User({ email, password });
    user.save(err => {
      if (err) return next(err);
      res.json({ token: tokenForUser(user) });
    });
  });
};
