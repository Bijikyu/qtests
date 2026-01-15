const express = require('express');
const qerrors = require('qerrors');
const db = require('../db');
const router = express.Router();

router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const userId = parseInt(id);
    const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    qerrors(error, 'users.get: retrieving user by ID', { userId: req.params.id });
    next(error);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be non-empty string' });
    }
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ error: 'Email is required and must be non-empty string' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const result = await db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
      [name.trim(), email.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    qerrors(error, 'users.post: creating new user', { name: req.body.name, email: req.body.email });
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.json({ users: result.rows, count: result.rows.length });
  } catch (error) {
    qerrors(error, 'users.get: retrieving all users');
    next(error);
  }
});

router.put('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const userId = parseInt(id);
    const existing = await db.query('SELECT id, name, email FROM users WHERE id = $1', [userId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (email) {
      const emailCheck = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    const updatedName = name || existing.rows[0].name;
    const updatedEmail = email || existing.rows[0].email;
    const result = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [updatedName, updatedEmail, userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    qerrors(error, 'users.put: updating user', { userId: req.params.id, name: req.body.name, email: req.body.email });
    next(error);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const userId = parseInt(id);
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    qerrors(error, 'users.delete: deleting user', { userId: req.params.id });
    next(error);
  }
});

module.exports = router;
