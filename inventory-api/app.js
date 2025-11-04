const express = require('express');
const inventoryRoutes = require('./routes/inventory');

const app = express();
app.use(express.json());

app.use('/api/inventory', inventoryRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`inventory-api_ listening on port ${port}`);
});

module.exports = app; // for tests
