const SupabaseService = require('../services/supabaseService');

class Gallery {
  static ALBUM_TABLE = 'gallery_albums';
  static MEDIA_TABLE = 'gallery';

  /**
   * Find gallery albums with pagination
   */
  static async findAlbums(filters = {}, { limit, offset } = {}) {
    const queryFilters = {};
    if (filters.search) {
      queryFilters.title = { ilike: filters.search };
    }

    return await SupabaseService.findAll(this.ALBUM_TABLE, {
      filters: queryFilters,
      limit,
      offset,
      order: { column: 'created_at', ascending: false }
    });
  }

  /**
   * Find an album by ID
   */
  static async findAlbumById(id) {
    return await SupabaseService.findOne(this.ALBUM_TABLE, id);
  }

  /**
   * Create an album
   */
  static async createAlbum(payload) {
    const data = {
      ...payload,
      created_at: new Date().toISOString()
    };
    return await SupabaseService.create(this.ALBUM_TABLE, data);
  }

  /**
   * Update an album
   */
  static async updateAlbum(id, payload) {
    return await SupabaseService.update(this.ALBUM_TABLE, { id }, payload);
  }

  /**
   * Delete an album (and optionally cascade deletion of media items)
   */
  static async deleteAlbum(id) {
    // Delete media in album first
    await SupabaseService.delete(this.MEDIA_TABLE, { album_id: id });
    return await SupabaseService.delete(this.ALBUM_TABLE, { id });
  }

  /**
   * Find media items inside albums
   */
  static async findMedia(filters = {}, { limit, offset } = {}) {
    const queryFilters = {};
    if (filters.album_id) {
      queryFilters.album_id = filters.album_id;
    }
    if (filters.type) {
      queryFilters.type = filters.type;
    }

    return await SupabaseService.findAll(this.MEDIA_TABLE, {
      filters: queryFilters,
      limit,
      offset,
      order: { column: 'created_at', ascending: false }
    });
  }

  /**
   * Add media item to an album
   */
  static async addMedia(payload) {
    const data = {
      ...payload,
      created_at: new Date().toISOString()
    };
    return await SupabaseService.create(this.MEDIA_TABLE, data);
  }

  /**
   * Delete media item by ID
   */
  static async deleteMedia(id) {
    return await SupabaseService.delete(this.MEDIA_TABLE, { id });
  }
}

module.exports = Gallery;
