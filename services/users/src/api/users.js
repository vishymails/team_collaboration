const express = require('express');
const router = express.Router();
const store = require('../data');

// Strip sensitive fields before sending user data in responses
function safe(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

router.get('/', (req, res) => {
  res.json({ success: true, data: store.users.map(safe) });
});

router.get('/:id', (req, res) => {
  const user = store.users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: safe(user) });
});

router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'name and email are required' });
  }
  const user = { id: store.nextId++, name, email };
  store.users.push(user);
  res.status(201).json({ success: true, data: safe(user) });
});

router.put('/:id', (req, res) => {
  const user = store.users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const { name, email } = req.body;
  if (!name && !email) {
    return res.status(400).json({ success: false, message: 'Provide at least name or email to update' });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  res.json({ success: true, data: safe(user) });
});

router.delete('/:id', (req, res) => {
  const index = store.users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });
  store.users.splice(index, 1);
  res.json({ success: true, message: 'User deleted' });
});

module.exports = router;
