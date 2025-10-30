import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // proceed to next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
