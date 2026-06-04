const express = require('express');
const router = express.Router();
const GalleryController = require('../controller/galleryController');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/authMiddleware');

// Public endpoints to browse albums and media items
router.get('/albums', optionalAuth, GalleryController.getAllAlbums);
router.get('/albums/:id', optionalAuth, GalleryController.getAlbumById);
router.get('/', optionalAuth, GalleryController.getMedia);

// Admin-only album management routes
router.post('/albums', requireAuth, requireRole(['admin', 'super_admin']), GalleryController.createAlbum);
router.put('/albums/:id', requireAuth, requireRole(['admin', 'super_admin']), GalleryController.updateAlbum);
router.delete('/albums/:id', requireAuth, requireRole(['admin', 'super_admin']), GalleryController.deleteAlbum);

// Admin-only media management routes (add/delete photos & videos)
router.post('/', requireAuth, requireRole(['admin', 'super_admin']), GalleryController.addMedia);
router.delete('/:id', requireAuth, requireRole(['admin', 'super_admin']), GalleryController.deleteMedia);

module.exports = router;
