const SupabaseService = require('../services/supabaseService');

class News {
  static TABLE = 'news';

  /**
   * Find news posts with filters and pagination
   */
  static async findAll(filters = {}, { limit, offset, order } = {}) {
    const queryFilters = {};

    if (filters.status) {
      queryFilters.status = filters.status;
    }
    if (filters.category) {
      queryFilters.category = filters.category;
    }
    if (filters.is_featured !== undefined) {
      queryFilters.is_featured = filters.is_featured;
    }
    if (filters.search) {
      queryFilters.title = { ilike: filters.search };
    }

    return await SupabaseService.findAll(this.TABLE, {
      filters: queryFilters,
      limit,
      offset,
      order: order || { column: 'published_at', ascending: false }
    });
  }

  /**
   * Find a specific news post by ID
   */
  static async findById(id) {
    return await SupabaseService.findOne(this.TABLE, id);
  }

  /**
   * Create a new news post
   */
  static async create(payload) {
    const data = {
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (data.status === 'published' && !data.published_at) {
      data.published_at = new Date().toISOString();
    }
    return await SupabaseService.create(this.TABLE, data);
  }

  /**
   * Update an existing news post
   */
  static async update(id, payload) {
    const data = {
      ...payload,
      updated_at: new Date().toISOString()
    };
    if (data.status === 'published' && !data.published_at) {
      data.published_at = new Date().toISOString();
    }
    return await SupabaseService.update(this.TABLE, { id }, data);
  }

  /**
   * Delete a news post
   */
  static async delete(id) {
    return await SupabaseService.delete(this.TABLE, { id });
  }
}

module.exports = News;
