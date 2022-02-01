const jwt = require('jsonwebtoken');
const {
  validateUserRegistrationData, validateUserLoginData,
} = require('../middlewares/validateUser');
require('dotenv').config();
const Model = require('../models/users.models');

const userRegistrationServices = async (dataUser) => {
  const { name, email, password } = dataUser;
  const role = 'user';

  const { error } = validateUserRegistrationData.validate({ name, email, password });
  if (error) return { status: 400, err: { message: 'Invalid entries. Try again' } };

  const alreadyExists = await Model.findUserByEmail(email);
  if (alreadyExists) return { status: 409, err: { message: 'Email already registered' } };

  const { insertedId } = await Model.registerUser({
    name, email, password, role,
  });

  return {
    _id: insertedId, name, email, password, role,
  };
};

const userLoginService = async (dataUser) => {
  const { email, password } = dataUser;

  const { error } = validateUserLoginData.validate({ email, password });
  if (error) return { status: 401, err: { message: 'All fields must be filled' } };

  const user = await Model.findUserByEmail(email);
  if (!user || user.password !== password) {
    return { status: 401, err: { message: 'Incorrect username or password' } };
  }

  const { _id, role } = user;
  const payload = { id: _id, email, role };
  const token = jwt.sign(payload, process.env.SENHA, {
    expiresIn: '1d',
  });

  return { token };
};

module.exports = {
  userRegistrationServices,
  userLoginService,
};
