const express = require('express');
const router = express.Router();
const NewsController = require('../controller/newsController');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/authMiddleware');

// Get all news articles and single article details
router.get('/', optionalAuth, NewsController.getAll);
router.get('/:id', optionalAuth, NewsController.getById);

// Admin-only publishing routes
router.post('/', requireAuth, requireRole(['admin', 'super_admin']), NewsController.create);
router.put('/:id', requireAuth, requireRole(['admin', 'super_admin']), NewsController.update);
router.delete('/:id', requireAuth, requireRole(['admin', 'super_admin']), NewsController.delete);

module.exports = router;
