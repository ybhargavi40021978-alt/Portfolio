const Profile = require('../models/Profile');

/**
 * @desc   Get portfolio profile information
 * @route  GET /api/profile
 * @access Public
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 });

    if (!profile) {
      // If MongoDB collection is empty, return an empty state payload with 200
      return res.status(200).json({
        name: null,
        role: null,
        headline: null,
        intro: null,
        bioParagraph1: null,
        bioParagraph2: null,
        portraitUrl: null,
        email: null,
        location: null,
        focus: null,
        availability: null,
        message: "No profile record found in database. Run database seed to populate initial data."
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile
};
