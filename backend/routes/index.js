const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const memberRouter = require('./members');
const eventRouter = require('./events');
const newsRouter = require('./news');
const galleryRouter = require('./gallery');
const contactRouter = require('./contact');
const complaintRouter = require('./complaints');

// API Healthcheck route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PrajapatiParivar.in API server is healthy and running.',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/auth', authRouter);
router.use('/members', memberRouter);
router.use('/events', eventRouter);
router.use('/news', newsRouter);
router.use('/gallery', galleryRouter);
router.use('/contact', contactRouter);
router.use('/complaints', complaintRouter);

module.exports = router;

