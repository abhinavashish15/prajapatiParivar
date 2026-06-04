const Complaint = require('../models/Complaint');
const { success, error } = require('../utils/response');

/**
 * Controller for community complaints and needs
 */
class ComplaintController {
  /**
   * Get all complaints and needs with filtering and pagination
   */
  static async getAll(req, res) {
    try {
      const { status, type, user_id, search, page = 1, limit = 10 } = req.query;

      const parsedLimit = parseInt(limit, 10);
      const offset = (parseInt(page, 10) - 1) * parsedLimit;

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      const isOwner = req.user && user_id && req.user.id === user_id;

      const filters = {
        type,
        search
      };

      // Status filtering logic
      if (isAdmin) {
        if (status) {
          filters.status = status;
        }
      } else if (isOwner) {
        if (status) {
          filters.status = status;
        }
        filters.user_id = req.user.id;
      } else {
        // Public view: only show approved or resolved complaints
        filters.status = ['approved', 'resolved'];
      }

      // If user_id filter is passed and verified (owner or admin)
      if (user_id && (isAdmin || isOwner)) {
        filters.user_id = user_id;
      }

      const { data, count, error: dbError } = await Complaint.findAll(filters, {
        limit: parsedLimit,
        offset
      });

      if (dbError) throw dbError;

      return success(res, 'Complaints/Needs fetched successfully', {
        complaints: data,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parsedLimit,
          pages: Math.ceil(count / parsedLimit)
        }
      });
    } catch (err) {
      console.error('ComplaintController.getAll error:', err);
      return error(res, 'Failed to fetch complaints.', 500);
    }
  }

  /**
   * Get single complaint/need by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return error(res, 'Complaint/Need not found.', 404);
      }

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      const isOwner = req.user && req.user.id === complaint.user_id;

      if (!isAdmin && !isOwner && !['approved', 'resolved'].includes(complaint.status)) {
        return error(res, 'Access denied. Complaint is not verified.', 403);
      }

      return success(res, 'Complaint/Need details fetched successfully', complaint);
    } catch (err) {
      console.error('ComplaintController.getById error:', err);
      return error(res, 'Failed to fetch details.', 500);
    }
  }

  /**
   * Submit a new complaint/need
   */
  static async create(req, res) {
    try {
      const payload = req.body;
      
      // Force user_id to match session user
      payload.user_id = req.user.id;
      // Force status to pending for normal submissions
      payload.status = 'pending';

      const newComplaint = await Complaint.create(payload);
      return success(res, 'Complaint/Need submitted successfully for admin verification.', newComplaint, 201);
    } catch (err) {
      console.error('ComplaintController.create error:', err);
      return error(res, 'Failed to submit complaint/need.', 500);
    }
  }

  /**
   * Update details of a complaint/need (by owner or admin)
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return error(res, 'Complaint/Need not found.', 404);
      }

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      const isOwner = req.user && req.user.id === complaint.user_id;

      if (!isAdmin && !isOwner) {
        return error(res, 'Access denied.', 403);
      }

      // If owner, they can only update if it is still pending
      if (isOwner && !isAdmin && complaint.status !== 'pending') {
        return error(res, 'Cannot edit a complaint/need that is already verified.', 400);
      }

      // Restrict status edits through this standard update (unless admin)
      if (!isAdmin) {
        delete payload.status;
        delete payload.verified_by;
        delete payload.verified_at;
        delete payload.resolved_at;
      }

      const updated = await Complaint.update(id, payload);
      return success(res, 'Complaint/Need updated successfully', updated);
    } catch (err) {
      console.error('ComplaintController.update error:', err);
      return error(res, 'Failed to update complaint/need.', 500);
    }
  }

  /**
   * Admin: Approve or Reject a complaint/need
   */
  static async verify(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'approved' or 'rejected'

      if (!['approved', 'rejected'].includes(status)) {
        return error(res, 'Invalid verification status. Must be approved or rejected.', 400);
      }

      const complaint = await Complaint.findById(id);
      if (!complaint) {
        return error(res, 'Complaint/Need not found.', 404);
      }

      const updated = await Complaint.update(id, {
        status,
        verified_by: req.user.id,
        verified_at: new Date().toISOString()
      });

      return success(res, `Complaint/Need successfully ${status}.`, updated);
    } catch (err) {
      console.error('ComplaintController.verify error:', err);
      return error(res, 'Failed to verify complaint/need.', 500);
    }
  }

  /**
   * Owner/Admin: Mark a complaint/need as resolved
   */
  static async resolve(req, res) {
    try {
      const { id } = req.params;
      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return error(res, 'Complaint/Need not found.', 404);
      }

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      const isOwner = req.user && req.user.id === complaint.user_id;

      if (!isAdmin && !isOwner) {
        return error(res, 'Access denied.', 403);
      }

      const updated = await Complaint.update(id, {
        status: 'resolved',
        resolved_at: new Date().toISOString()
      });

      return success(res, 'Complaint/Need marked as resolved successfully.', updated);
    } catch (err) {
      console.error('ComplaintController.resolve error:', err);
      return error(res, 'Failed to resolve complaint/need.', 500);
    }
  }

  /**
   * Owner/Admin: Delete a complaint/need
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return error(res, 'Complaint/Need not found.', 404);
      }

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      const isOwner = req.user && req.user.id === complaint.user_id;

      if (!isAdmin && !isOwner) {
        return error(res, 'Access denied.', 403);
      }

      await Complaint.delete(id);
      return success(res, 'Complaint/Need deleted successfully.');
    } catch (err) {
      console.error('ComplaintController.delete error:', err);
      return error(res, 'Failed to delete complaint/need.', 500);
    }
  }
}

module.exports = ComplaintController;
