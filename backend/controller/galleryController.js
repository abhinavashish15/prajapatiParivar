const Gallery = require('../models/Gallery');
const { success, error } = require('../utils/response');

/**
 * Controller for Gallery album and media operations
 */
class GalleryController {
  /**
   * Get all albums
   */
  static async getAllAlbums(req, res) {
    try {
      const { search, page = 1, limit = 12 } = req.query;
      const parsedLimit = parseInt(limit, 10);
      const offset = (parseInt(page, 10) - 1) * parsedLimit;

      const { data, count, error: dbError } = await Gallery.findAlbums(
        { search },
        { limit: parsedLimit, offset }
      );

      if (dbError) throw dbError;

      return success(res, 'Gallery albums fetched successfully', {
        albums: data,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parsedLimit,
          pages: Math.ceil(count / parsedLimit)
        }
      });
    } catch (err) {
      console.error('GalleryController.getAllAlbums error:', err);
      return error(res, 'Failed to fetch gallery albums.', 500);
    }
  }

  /**
   * Get single album by ID
   */
  static async getAlbumById(req, res) {
    try {
      const { id } = req.params;
      const album = await Gallery.findAlbumById(id);

      if (!album) {
        return error(res, 'Gallery album not found.', 404);
      }

      return success(res, 'Gallery album fetched successfully', album);
    } catch (err) {
      console.error('GalleryController.getAlbumById error:', err);
      return error(res, 'Failed to fetch album details.', 500);
    }
  }

  /**
   * Admin: Create an album
   */
  static async createAlbum(req, res) {
    try {
      const payload = req.body;
      const newAlbum = await Gallery.createAlbum(payload);
      return success(res, 'Gallery album created successfully', newAlbum, 201);
    } catch (err) {
      console.error('GalleryController.createAlbum error:', err);
      return error(res, 'Failed to create gallery album.', 500);
    }
  }

  /**
   * Admin: Update an album
   */
  static async updateAlbum(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const updated = await Gallery.updateAlbum(id, payload);
      return success(res, 'Gallery album updated successfully', updated);
    } catch (err) {
      console.error('GalleryController.updateAlbum error:', err);
      return error(res, 'Failed to update gallery album.', 500);
    }
  }

  /**
   * Admin: Delete an album
   */
  static async deleteAlbum(req, res) {
    try {
      const { id } = req.params;
      await Gallery.deleteAlbum(id);
      return success(res, 'Gallery album and its media deleted successfully');
    } catch (err) {
      console.error('GalleryController.deleteAlbum error:', err);
      return error(res, 'Failed to delete gallery album.', 500);
    }
  }

  /**
   * Get all media items (photos and videos), optional filtering by album
   */
  static async getMedia(req, res) {
    try {
      const { album_id, type, page = 1, limit = 20 } = req.query;
      const parsedLimit = parseInt(limit, 10);
      const offset = (parseInt(page, 10) - 1) * parsedLimit;

      const { data, count, error: dbError } = await Gallery.findMedia(
        { album_id, type },
        { limit: parsedLimit, offset }
      );

      if (dbError) throw dbError;

      return success(res, 'Gallery media items fetched successfully', {
        media: data,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parsedLimit,
          pages: Math.ceil(count / parsedLimit)
        }
      });
    } catch (err) {
      console.error('GalleryController.getMedia error:', err);
      return error(res, 'Failed to fetch gallery media.', 500);
    }
  }

  /**
   * Admin: Add media to album
   */
  static async addMedia(req, res) {
    try {
      const payload = req.body;
      
      if (!payload.album_id || !payload.url) {
        return error(res, 'Album ID and media URL are required fields.', 400);
      }

      const media = await Gallery.addMedia(payload);
      return success(res, 'Media item added to gallery successfully', media, 201);
    } catch (err) {
      console.error('GalleryController.addMedia error:', err);
      return error(res, 'Failed to upload media item.', 500);
    }
  }

  /**
   * Admin: Delete media item
   */
  static async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      await Gallery.deleteMedia(id);
      return success(res, 'Gallery media item deleted successfully');
    } catch (err) {
      console.error('GalleryController.deleteMedia error:', err);
      return error(res, 'Failed to delete media item.', 500);
    }
  }
}

module.exports = GalleryController;
