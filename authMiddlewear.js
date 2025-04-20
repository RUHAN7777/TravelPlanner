const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach both _id and id safely
    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id, // fallback if only one exists
      id: decoded.id || decoded._id   // keep both to avoid breaking any old logic
    };

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
