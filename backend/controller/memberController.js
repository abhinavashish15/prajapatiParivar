const Member = require('../models/Member');
const { success, error } = require('../utils/response');

/**
 * Controller for member profile operations
 */
class MemberController {
  /**
   * Get all members (public or admin list)
   */
  static async getAll(req, res) {
    try {
      const { status, gender, state, city, district, profession, search, page = 1, limit = 10, is_featured } = req.query;
      
      const parsedLimit = parseInt(limit, 10);
      const offset = (parseInt(page, 10) - 1) * parsedLimit;

      // Allow fetching all members regardless of status if not specified
      // (User requested all members to be shown in the directory)
      const queryStatus = status; 

      const filters = {
        status: queryStatus,
        gender,
        state,
        city,
        district,
        profession,
        search,
        is_featured: is_featured !== undefined ? (is_featured === 'true') : undefined
      };

      const { data, count, error: dbError } = await Member.findAll(filters, {
        limit: parsedLimit,
        offset,
        order: { column: 'full_name', ascending: true }
      });

      if (dbError) throw dbError;

      const membersWithRoles = data.map(m => ({
        ...m,
        role: m.role || 'guest'
      }));

      return success(res, 'Members retrieved successfully', {
        members: membersWithRoles,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parsedLimit,
          pages: Math.ceil(count / parsedLimit)
        }
      });
    } catch (err) {
      console.error('MemberController.getAll error:', err);
      return error(res, 'Failed to fetch members list.', 500);
    }
  }

  /**
   * Get member profile by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const profile = await Member.findById(id);

      if (!profile) {
        return error(res, 'Member profile not found.', 404);
      }

      // If profile is not approved, only admins or the owner can view it
      const isOwner = req.user && req.user.id === id;
      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);

      if (profile.status !== 'approved' && !isOwner && !isAdmin) {
        return error(res, 'Access denied. Profile is pending approval.', 403);
      }

      // Fetch user's role too
      const roleRecord = await Member.getRole(id);
      const role = roleRecord ? roleRecord.role : 'guest';

      return success(res, 'Member profile fetched successfully', {
        profile,
        role
      });
    } catch (err) {
      console.error('MemberController.getById error:', err);
      return error(res, 'Failed to fetch member profile.', 500);
    }
  }

  /**
   * Get current user's profile
   */
  static async getMyProfile(req, res) {
    try {
      const userId = req.user.id;
      let profile = await Member.findById(userId);

      // If profile doesn't exist, return default structure (not error) to let them initialize
      if (!profile) {
        return success(res, 'Profile has not been initialized yet', {
          profile: null,
          role: req.user.role
        });
      }

      return success(res, 'My profile fetched successfully', {
        profile,
        role: req.user.role
      });
    } catch (err) {
      console.error('MemberController.getMyProfile error:', err);
      return error(res, 'Failed to fetch your profile.', 500);
    }
  }

  /**
   * Create or update current user's profile
   */
  static async updateMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const payload = req.body;

      // Ensure they don't overwrite critical field values
      delete payload.id;
      delete payload.status;
      
      // Enforce email matches auth user if provided, or fallback to token email
      payload.email = req.user.email;

      const profile = await Member.upsert(userId, payload);
      return success(res, 'Profile updated successfully', profile);
    } catch (err) {
      console.error('MemberController.updateMyProfile error:', err);
      return error(res, 'Failed to update profile.', 500);
    }
  }

  /**
   * Delete current user's profile and account completely
   */
  static async deleteMyProfile(req, res) {
    try {
      const userId = req.user.id;
      
      // 1. Delete from member_profiles via SupabaseService
      const SupabaseService = require('../services/supabaseService');
      await SupabaseService.delete('member_profiles', userId);

      // 2. Delete the actual user account using Supabase Admin Auth
      const { supabaseAdmin } = require('../config/supabase');
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (deleteAuthError) {
        console.error('Failed to delete auth user:', deleteAuthError);
        return error(res, 'Failed to fully delete account from auth system.', 500);
      }

      return success(res, 'Account completely deleted');
    } catch (err) {
      console.error('MemberController.deleteMyProfile error:', err);
      return error(res, 'Failed to delete account.', 500);
    }
  }

  /**
   * Admin: Approve a member profile
   */
  static async approve(req, res) {
    try {
      const { id } = req.params;
      
      const roleData = await Member.getRole(id);
      if (roleData && (roleData.role === 'admin' || roleData.role === 'super_admin')) {
        return error(res, 'Admin accounts are independent and cannot have their status modified.', 403);
      }

      const updated = await Member.approve(id);
      return success(res, 'Member profile approved successfully', updated);
    } catch (err) {
      console.error('MemberController.approve error:', err);
      return error(res, 'Failed to approve member profile.', 500);
    }
  }

  /**
   * Admin: Reject a member profile
   */
  static async reject(req, res) {
    try {
      const { id } = req.params;

      const roleData = await Member.getRole(id);
      if (roleData && (roleData.role === 'admin' || roleData.role === 'super_admin')) {
        return error(res, 'Admin accounts are independent and cannot be rejected.', 403);
      }

      const updated = await Member.reject(id);
      return success(res, 'Member profile rejected successfully', updated);
    } catch (err) {
      console.error('MemberController.reject error:', err);
      return error(res, 'Failed to reject member profile.', 500);
    }
  }

  /**
   * Admin: Toggle featured status
   */
  static async toggleFeatured(req, res) {
    try {
      const { id } = req.params;
      const { is_featured } = req.body;
      
      if (typeof is_featured !== 'boolean') {
        return error(res, 'Invalid is_featured value. Must be a boolean.', 400);
      }

      const updated = await Member.toggleFeatured(id, is_featured);
      return success(res, `Member profile featured status updated to ${is_featured}`, updated);
    } catch (err) {
      console.error('MemberController.toggleFeatured error:', err);
      return error(res, 'Failed to update featured status.', 500);
    }
  }

  /**
   * Admin: Change a member's role
   */
  static async changeRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !['super_admin', 'admin', 'member', 'guest'].includes(role)) {
        return error(res, 'Invalid role value specified.', 400);
      }

      // Only super_admin can set super_admin or admin roles
      if (['super_admin', 'admin'].includes(role) && req.user.role !== 'super_admin') {
        return error(res, 'Forbidden. Only super admins can assign administrative roles.', 403);
      }

      const updated = await Member.setRole(id, role);
      return success(res, 'User role updated successfully', updated);
    } catch (err) {
      console.error('MemberController.changeRole error:', err);
      return error(res, 'Failed to update member role.', 500);
    }
  }

  /**
   * Admin: Completely delete a member and auth account
   */
  static async deleteMember(req, res) {
    try {
      const { id } = req.params;

      // Ensure super_admin role if preventing normal admins from deleting, 
      // but if we want admins to delete, we just proceed.
      // (Assuming `requireRole(['admin', 'super_admin'])` handles basic auth)

      // Prevent user from deleting themselves
      if (req.user.id === id) {
        return error(res, 'You cannot delete your own account.', 403);
      }

      const result = await Member.deletePermanently(id);
      return success(res, 'User account and profile permanently deleted.', result);
    } catch (err) {
      console.error('MemberController.deleteMember error:', err);
      return error(res, 'Failed to permanently delete user.', 500);
    }
  }
}

module.exports = MemberController;
