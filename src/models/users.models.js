const connection = require('./connection');

const registerUser = async (dataUser) => {
  const db = await connection();
  const {
    name, email, password, role,
  } = dataUser;

  const query = await db.collection('users').insertOne({
    name, email, password, role,
  });

  return query;
};

const findUserByEmail = async (email) => {
  const db = await connection();
  const query = await db.collection('users').findOne({ email });

  return query;
};

const loginUser = async (dataUser) => {
  const { email, password } = dataUser;
  const db = await connection();
  const query = await db.collection('users').insertOne({ email, password });

  return query;
};

module.exports = {
  registerUser,
  findUserByEmail,
  loginUser,
};
