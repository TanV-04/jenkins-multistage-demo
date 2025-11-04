const express = require('express');
const router = express.Router();

// In-memory sample data
let items = [
  { id: 1, name: 'apple', qty: 10 },
  { id: 2, name: 'banana', qty: 5 }
];

// GET all
router.get('/', (req, res) => {
  res.json(items);
});

// POST to add
router.post('/', (req, res) => {
  const { name, qty } = req.body;
  if (!name || qty == null) return res.status(400).json({ error: 'name and qty required' });
  const id = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { id, name, qty };
  items.push(newItem);
  res.status(201).json(newItem);
});

module.exports = router;
