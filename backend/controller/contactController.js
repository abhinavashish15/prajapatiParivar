const ContactMessage = require('../models/ContactMessage');
const { success, error } = require('../utils/response');

/**
 * Controller for Contact Helpdesk operations
 */
class ContactController {
  /**
   * Submit a contact message (Public form submission)
   */
  static async submitMessage(req, res) {
    try {
      const { name, email, mobile, subject, message } = req.body;

      if (!name || !email || !message) {
        return error(res, 'Name, email, and message are required fields.', 400);
      }

      const newMessage = await ContactMessage.create({
        name,
        email,
        mobile,
        subject,
        message
      });

      return success(res, 'Contact message submitted successfully. We will get back to you soon.', newMessage, 201);
    } catch (err) {
      console.error('ContactController.submitMessage error:', err);
      return error(res, 'Failed to submit contact message. Please try again later.', 500);
    }
  }

  /**
   * Admin: Get all contact messages
   */
  static async getAllMessages(req, res) {
    try {
      const { email, search, page = 1, limit = 10 } = req.query;
      const parsedLimit = parseInt(limit, 10);
      const offset = (parseInt(page, 10) - 1) * parsedLimit;

      const { data, count, error: dbError } = await ContactMessage.findAll(
        { email, search },
        { limit: parsedLimit, offset }
      );

      if (dbError) throw dbError;

      return success(res, 'Contact messages fetched successfully', {
        messages: data,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parsedLimit,
          pages: Math.ceil(count / parsedLimit)
        }
      });
    } catch (err) {
      console.error('ContactController.getAllMessages error:', err);
      return error(res, 'Failed to fetch contact messages.', 500);
    }
  }

  /**
   * Admin: Delete a contact message
   */
  static async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      await ContactMessage.delete(id);
      return success(res, 'Contact message deleted successfully.');
    } catch (err) {
      console.error('ContactController.deleteMessage error:', err);
      return error(res, 'Failed to delete contact message.', 500);
    }
  }
}

module.exports = ContactController;
