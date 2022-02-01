const { validateUserData } = require('../middlewares/validateRegister');
const Model = require('../models/users.models');

const userRegistrationServices = async (dataUser) => {
  const { name, email, password } = dataUser;
  const role = 'user';

  const { error } = validateUserData.validate({ name, email, password });
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

module.exports = {
  userRegistrationServices,
};
