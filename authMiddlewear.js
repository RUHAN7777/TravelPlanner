const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret from the environment variable
    req.user = decoded; // Attach decoded user data to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
