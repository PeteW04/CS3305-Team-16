import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const checkUserOrganisation = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken; // allows me to access all of the user info cause idk what I actually need

        const orgId = req.params.organizationId || req.body.organizationId; // params for if the id is in the URL, body if its in the request itself -- idk whats right but this is safe

        // check if the organisationID is correct
        if (decodedToken.organizationId !== orgId) {
            return res.status(400).json({ message: "Unauthorized" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};