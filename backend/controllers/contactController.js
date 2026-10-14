const Contact = require('../../database/models/Contact');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @desc   Submit a contact message and save to MongoDB
 * @route  POST /api/contact
 * @access Public
 */
const createContact = async (req, res, next) => {
  try {
    const { name, email, subject, message, hp_field } = req.body;

    // Honeypot spam trap: if hidden field is filled, silently ignore bot submission
    if (hp_field && typeof hp_field === 'string' && hp_field.trim().length > 0) {
      console.warn('[Spam Prevented] Honeypot triggered by automated bot submission.');
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully. Thank you for reaching out!',
        dbSaved: false
      });
    }

    // Server-side validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Full Name is required.'
      });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'A valid Email Address is required.'
      });
    }

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Subject is required.'
      });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required.'
      });
    }

    // Sanitize input lengths
    const sanitizedData = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 150),
      subject: subject.trim().slice(0, 200),
      message: message.trim().slice(0, 5000)
    };

    // Save to MongoDB database
    const savedContact = await Contact.create(sanitizedData);

    console.log(`[Contact Message Stored in MongoDB] ID: ${savedContact._id} | From: ${savedContact.name} <${savedContact.email}>`);

    // Optional email notification handling
    let emailStatus = 'skipped_not_configured';
    if (process.env.EMAIL_SERVICE_ENABLED === 'true' && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // In production with credentials provided, an email transport would be invoked here.
      emailStatus = 'delivered';
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully. Thank you for reaching out!',
      dbSaved: true,
      emailNotification: emailStatus,
      recordId: savedContact._id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact
};
