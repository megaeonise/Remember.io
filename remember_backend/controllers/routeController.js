const Route = require('../models/routeModel');

const saveRoute = async (req, res) => {
  try {
    const { userId, name, end } = req.body;
    const route = new Route({ userId, name, end });
    await route.save();
    res.status(201).json({ success: true, message: 'Route saved successfully', route });
  } catch (error) {
    console.error('Save route error:', error);
    res.status(500).json({ success: false, message: 'Failed to save route', error: error.message });
  }
};

const getRoutes = async (req, res) => {
  try {
    const { userId } = req.params;
    const routes = await Route.find({ userId });
    res.status(200).json({ success: true, routes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load routes', error });
  }
};

module.exports = { saveRoute, getRoutes };