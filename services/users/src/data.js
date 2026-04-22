// Demo seed data — passwords must be hashed (e.g. bcrypt) before storing real credentials
const crypto = require('crypto');

function hashPassword(plain) {
  return crypto.createHash('sha256').update(plain).digest('hex');
}

module.exports = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', passwordHash: hashPassword('alice123') },
    { id: 2, name: 'Bob', email: 'bob@example.com', passwordHash: hashPassword('bob123') },
  ],
  nextId: 3,
};
