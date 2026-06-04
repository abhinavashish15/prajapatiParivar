const express = require('express');
const router = express.Router();
const ContactController = require('../controller/contactController');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/authMiddleware');

// Public contact form submission
router.post('/', optionalAuth, ContactController.submitMessage);

// Admin-only contact messages access
router.get('/messages', requireAuth, requireRole(['admin', 'super_admin']), ContactController.getAllMessages);
router.delete('/messages/:id', requireAuth, requireRole(['admin', 'super_admin']), ContactController.deleteMessage);

module.exports = router;
