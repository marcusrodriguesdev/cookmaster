const Joi = require('joi');

const validateUserRegistrationData = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i).required(),
  password: Joi.string().required(),
});

const validateUserLoginData = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  validateUserRegistrationData,
  validateUserLoginData,
};
