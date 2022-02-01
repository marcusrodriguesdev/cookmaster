const Joi = require('joi');

const validateUserData = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i).required(),
  password: Joi.string().required(),
});

module.exports = {
  validateUserData,
};
