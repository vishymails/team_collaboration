const express = require('express');
const router = express.Router();

let products = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
  { id: 2, name: 'Mouse', price: 29.99, stock: 50 },
];
let nextId = 3;

router.get('/', (req, res) => {
  res.json({ success: true, data: products });
});

router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

router.post('/', (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ success: false, message: 'name and price are required' });
  }
  const product = { id: nextId++, name, price, stock: stock ?? 0 };
  products.push(product);
  res.status(201).json({ success: true, data: product });
});

router.put('/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const { name, price, stock } = req.body;
  if (name == null && price == null && stock == null) {
    return res.status(400).json({ success: false, message: 'Provide at least one field to update' });
  }

  if (name != null) product.name = name;
  if (price != null) product.price = price;
  if (stock != null) product.stock = stock;

  res.json({ success: true, data: product });
});

router.delete('/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  products.splice(index, 1);
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = router;
