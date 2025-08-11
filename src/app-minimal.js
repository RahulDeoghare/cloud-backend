require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8001;

// Minimal middleware
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
});