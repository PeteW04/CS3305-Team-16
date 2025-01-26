import jwt from 'jsonwebtoken';
import User from '../models/User';

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedToken.id).select('-password');
        next();
    } catch (e) {
        console.error("Authentication Error: ", e.message);
        res.status(400).json({ message: 'Token invalid/expired' });
    }
}