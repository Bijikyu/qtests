// User management routes for demo purposes
// Rationale: provide user endpoints expected by frontend demo and test examples
const express = require('express');
const router = express.Router();

// In-memory user storage for demo
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];
let nextId = 4;

// GET /api/users/:id - Get user by ID
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  
  // Validate ID format
  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  
  const userId = parseInt(id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// POST /api/users - Create new user
router.post('/users', (req, res) => {
  const { name, email } = req.body;
  
// Basic validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required and must be non-empty string' });
  }
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return res.status(400).json({ error: 'Email is required and must be non-empty string' });
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Check for duplicate email
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json(newUser);
});

// GET /api/users - Get all users
router.get('/users', (req, res) => {
  res.json({ users, count: users.length });
});

// PUT /api/users/:id - Update user
router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  
  const userId = parseInt(id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (name) users[userIndex].name = name;
  if (email) {
    // Check for duplicate email (excluding current user)
    if (users.some(u => u.email === email && u.id !== userId)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    users[userIndex].email = email;
  }
  
  res.json(users[userIndex]);
});

// DELETE /api/users/:id - Delete user
router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  
  const userId = parseInt(id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({ message: 'User deleted successfully', user: deletedUser });
});

module.exports = router;