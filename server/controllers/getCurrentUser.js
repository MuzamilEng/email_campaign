const User = require("../models/User");
exports.getCurrentUser = async (req, res) => {
  try {
    // const id = req.params.id;
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
