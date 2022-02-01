const express = require('express');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users.router');

const app = express();

app.use(bodyParser.json());
app.use('/users', routerUsers);

module.exports = app;
