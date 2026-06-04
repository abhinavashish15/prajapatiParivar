require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRouter = require('./routes');
const { error } = require('./utils/response');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main router mount
app.use('/api/v1', apiRouter);

// Root route welcome
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the PrajapatiParivar.in Community API Service.',
    documentation: '/api/v1/health'
  });
});

// Fallback 404 handler
app.use((req, res) => {
  return error(res, `API route [${req.method}] ${req.url} not found.`, 404);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return error(res, 'Internal Server Error.', 500, process.env.NODE_ENV === 'development' ? err.message : null);
});

// Start listening
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` PrajapatiParivar.in Server is running on port ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Healthcheck: http://localhost:${PORT}/api/v1/health`);
  console.log(`==================================================`);
});
