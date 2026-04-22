const express = require('express');
const usersRouter = require('./src/api/users');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'users', status: 'ok' });
});

app.use('/users', usersRouter);

module.exports = app;
