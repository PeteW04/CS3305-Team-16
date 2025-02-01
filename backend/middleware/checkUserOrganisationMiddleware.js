export const checkUserOrganisation = (requiredOrganisation) => async (req, res, next) => {
    if (!req.user || req.user.organisation !== requiredOrganisation) {
        return res.status(400).json({ message: "Unauthorized" });
    }

    next();
};