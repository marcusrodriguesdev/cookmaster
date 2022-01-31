const request = require('supertest');
const { MongoClient } = require('mongodb');
const server = require('../src/api/server');

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

describe('1 - Crie um endpoint para o cadastro de usuários', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, OPTIONS);
    db = connection.db('Cookmaster');
    await db.collection('users').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
    const obj = {
      name: 'Marcus', email: 'marcusrodriguesdev@gmail.com', password: '1234567', role: 'admin',
    };
    await db.collection('users').insertOne(obj);
  });

  afterEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que o campo "name" é obrigatório', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        email: 'joaodev@gmail.com',
        password: '1234567',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid entries. Try again' });
  });

  it('Será validado que o campo "email" é obrigatório', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        name: 'Marcus',
        password: '1234567',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid entries. Try again' });
  });

  it('Será validado que não é possível cadastrar usuário com o campo email inválido', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        name: 'Marcus',
        email: 'marcusrodrigues@',
        password: '1234567',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid entries. Try again' });
  });

  it('Será validado que o campo "senha" é obrigatório', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        name: 'Marcus',
        email: 'marcusrodrigues@gmail.com',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid entries. Try again' });
  });

  it('Será validado que o campo "email" é único', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        name: 'Marcus',
        email: 'marcusrodriguesdev@gmail.com',
        password: '1234567',
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual({ message: 'Email already registered' });
  });

  it('Será validado que é possível cadastrar usuário com sucesso', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        name: 'Vinicius',
        email: 'marcusvinicius@gmail.com',
        password: '12345678',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('name');
    expect(res.body.user).toHaveProperty('email');
    expect(res.body.user).toHaveProperty('role');
    expect(res.body.user).toHaveProperty('_id');
  });
});

describe('2 - Crie um endpoint para o login de usuários', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, OPTIONS);
    db = connection.db('Cookmaster');
    await db.collection('users').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
    const obj = {
      name: 'Marcus', email: 'marcusrodriguesdev@gmail.com', password: '1234567', role: 'admin',
    };
    await db.collection('users').insertOne(obj);
  });

  afterEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que o campo "email" é obrigatório', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        password: '12345678',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'All fields must be filled' });
  });

  it('Será validado que o campo "password" é obrigatório', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        email: 'marcus.rodrigues@gmail.com',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'All fields must be filled' });
  });

  it('Será validado que não é possível fazer login com um email inválido', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        email: 'marcusrodrigues@',
        password: '12345678',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'Incorrect username or password' });
  });

  it('Será validado que não é possível fazer login com uma senha inválida', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        email: 'marcusemail@gmail.com',
        password: '123',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'Incorrect username or password' });
  });

  it('Será validado que é possível fazer login com sucesso', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        email: 'marcusvinicius@gmail.com',
        password: '1234567',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).not.toBeNull();
  });
});
