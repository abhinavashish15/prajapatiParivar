const News = require('../models/News');
const { success, error } = require('../utils/response');

/**
 * Controller for news and announcement operations
 */
class NewsController {
  /**
   * Get all news articles
   */
  static async getAll(req, res) {
    try {
      const { status, category, is_featured, search, page = 1, limit = 10 } = req.query;

      const parsedLimit = parseInt(limit, 10);
      const offset = (parseInt(page, 10) - 1) * parsedLimit;

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      
      // Non-admins can only see published articles
      let queryStatus = 'published';
      if (isAdmin && status) {
        queryStatus = status;
      }

      const filters = {
        category,
        search
      };

      if (!isAdmin || status) {
        filters.status = queryStatus;
      }

      if (is_featured !== undefined) {
        filters.is_featured = is_featured === 'true';
      }

      const { data, count, error: dbError } = await News.findAll(filters, {
        limit: parsedLimit,
        offset
      });

      if (dbError) throw dbError;

      return success(res, 'News articles fetched successfully', {
        news: data,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parsedLimit,
          pages: Math.ceil(count / parsedLimit)
        }
      });
    } catch (err) {
      console.error('NewsController.getAll error:', err);
      return error(res, 'Failed to fetch news articles.', 500);
    }
  }

  /**
   * Get single news article by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const article = await News.findById(id);

      if (!article) {
        return error(res, 'News article not found.', 404);
      }

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      if (article.status !== 'published' && !isAdmin) {
        return error(res, 'Access denied. News article is a draft.', 403);
      }

      return success(res, 'News article fetched successfully', article);
    } catch (err) {
      console.error('NewsController.getById error:', err);
      return error(res, 'Failed to fetch news article details.', 500);
    }
  }

  /**
   * Admin: Create a news article
   */
  static async create(req, res) {
    try {
      const payload = req.body;
      payload.author_id = req.user.id;

      const newArticle = await News.create(payload);
      return success(res, 'News article created successfully', newArticle, 201);
    } catch (err) {
      console.error('NewsController.create error:', err);
      return error(res, 'Failed to create news article.', 500);
    }
  }

  /**
   * Admin: Update a news article
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const updated = await News.update(id, payload);
      return success(res, 'News article updated successfully', updated);
    } catch (err) {
      console.error('NewsController.update error:', err);
      return error(res, 'Failed to update news article.', 500);
    }
  }

  /**
   * Admin: Delete a news article
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await News.delete(id);
      return success(res, 'News article deleted successfully');
    } catch (err) {
      console.error('NewsController.delete error:', err);
      return error(res, 'Failed to delete news article.', 500);
    }
  }
}

module.exports = NewsController;
