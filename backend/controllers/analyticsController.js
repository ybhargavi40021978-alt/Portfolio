const Analytics = require('../../database/models/Analytics');

function getDeviceType(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile';
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  if (ua) return 'desktop';
  return 'unknown';
}

/**
 * @desc   Record an aggregate page view
 * @route  POST /api/analytics/pageview
 * @access Public (rate-limited)
 */
const recordPageView = async (req, res, next) => {
  try {
    const { page } = req.body;
    if (!page || typeof page !== 'string') {
      return res.status(400).json({ success: false, error: 'Page path is required.' });
    }

    const deviceType = getDeviceType(req.headers['user-agent']);

    await Analytics.create({
      type: 'pageview',
      page: page.trim().slice(0, 100),
      deviceType
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Record project demo or source click
 * @route  POST /api/analytics/click
 * @access Public (rate-limited)
 */
const recordProjectClick = async (req, res, next) => {
  try {
    const { projectId, projectTitle, linkType } = req.body;

    if (!projectTitle && !projectId) {
      return res.status(400).json({ success: false, error: 'Project identifier or title required.' });
    }

    await Analytics.create({
      type: 'project_click',
      projectId: projectId ? String(projectId).slice(0, 50) : null,
      projectTitle: projectTitle ? String(projectTitle).slice(0, 100) : null,
      linkType: ['live', 'source'].includes(linkType) ? linkType : null,
      deviceType: getDeviceType(req.headers['user-agent'])
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get aggregate statistics (Protected endpoint for portfolio owner)
 * @route  GET /api/analytics/stats
 * @access Private (x-admin-key required)
 */
const getStats = async (req, res, next) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_API_KEY || 'portfolio_admin_secret_2026';

    if (!adminKey || adminKey !== expectedKey) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Valid x-admin-key header is required to access analytics statistics.'
      });
    }

    const [totalPageViews, totalClicks, viewsByPage, clicksByProject] = await Promise.all([
      Analytics.countDocuments({ type: 'pageview' }),
      Analytics.countDocuments({ type: 'project_click' }),
      Analytics.aggregate([
        { $match: { type: 'pageview' } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Analytics.aggregate([
        { $match: { type: 'project_click' } },
        { $group: { _id: { project: '$projectTitle', linkType: '$linkType' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPageViews,
        totalClicks,
        viewsByPage,
        clicksByProject
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordPageView,
  recordProjectClick,
  getStats
};
