// Check if the user has the required role to access
export const checkUserRole = (requiredRole) => (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
        return res.status(400).json({ message: "Unauthorized" });
    }

    next();
};