const Service = require('../services/users.services');

const registerUser = async (_req, res) => {
  const { name, email, password } = _req.body;
  const user = await Service.userRegistrationServices({ name, email, password });

  if (user.err) return res.status(user.status).json({ message: user.err.message });

  return res.status(201).json({ user });
};

module.exports = {
  registerUser,
};
