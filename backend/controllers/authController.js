import User from "../models/User";
import Organization from "../models/Organization";
import { hashPassword } from "../utils/passwordHash";

export const registerManager = async (req, res) => {
    const { firstName, lastName, email, password, organizationName, description } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const organization = await Organization.create({ name: organizationName, description });

        const manager = await User.create({ firstName, lastName, password: hashedPassword, role: "manager", organizationId: organization._id });

        organization.employees.push(manager._id);
        organization.owner = manager._id;

        await organization.save();

        const token = jwt.sign({ id: manager._id }, process.env.JWT_SECRET, { expiresIn: "7D" })
        res.status(201).json({ token })
    } catch (e) {
        console.error("Error in registerManager:", e.message);
        res.status(500).json({ message: e.message });
    }
}