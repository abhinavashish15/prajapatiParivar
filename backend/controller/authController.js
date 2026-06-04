const { supabaseAdmin } = require('../config/supabase');
const Member = require('../models/Member');
const { success, error } = require('../utils/response');

class AuthController {
  /**
   * Register a new user and create their profile
   */
  static async signUp(req, res) {
    try {
      const { email, password, profileData } = req.body;

      if (!email || !password || !profileData) {
        return error(res, 'Email, password, and profile data are required.', 400);
      }

      // We use admin.createUser to explicitly create and auto-confirm, 
      // and also avoid Supabase returning fake user IDs for duplicate emails.
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: profileData.name,
          father_husband_name: profileData.fatherName,
          mother_name: profileData.motherName,
          gender: profileData.gender,
          dob: profileData.dob,
          mobile: profileData.phone,
          address: profileData.address,
          state: profileData.state,
          district: profileData.district,
          profession: profileData.occupation,
          marital_status: profileData.maritalStatus,
          profile_photo: profileData.profile_photo
        }
      });

      if (authError) {
        return error(res, authError.message, 400);
      }

      const userId = authData.user?.id;
      if (!userId) {
        return error(res, 'Failed to retrieve user ID after registration.', 500);
      }

      // 2. Create the Member Profile
      const newProfile = {
        full_name: profileData.name,
        father_husband_name: profileData.fatherName,
        mother_name: profileData.motherName || null,
        gender: profileData.gender,
        marital_status: profileData.maritalStatus,
        dob: profileData.dob,
        mobile: profileData.phone,
        email: email,
        profession: profileData.occupation,
        address: `${profileData.address}, Pincode: ${profileData.pincode}`,
        district: profileData.district,
        state: profileData.state,
        profile_photo: profileData.profile_photo || null
      };

      const profile = await Member.upsert(userId, newProfile);

      // 3. Assign Role (First user = super_admin, others = guest)
      const { data: existingRoles } = await supabaseAdmin.from('user_roles').select('id').limit(1);
      const isFirstUser = !existingRoles || existingRoles.length === 0;
      await Member.setRole(userId, isFirstUser ? 'super_admin' : 'guest');

      return success(res, 'Registration successful. Please check your email to verify your account (if required).', {
        user: authData.user,
        session: authData.session,
        profile
      });
    } catch (err) {
      console.error('AuthController.signUp error:', err);
      return error(res, 'An error occurred during registration.', 500);
    }
  }

  /**
   * Authenticate a user and return a session
   */
  static async signIn(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return error(res, 'Email and password are required.', 400);
      }

      const { data, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return error(res, authError.message, 401);
      }

      return success(res, 'Login successful', {
        user: data.user,
        session: data.session
      });
    } catch (err) {
      console.error('AuthController.signIn error:', err);
      return error(res, 'An error occurred during login.', 500);
    }
  }
}

module.exports = AuthController;
