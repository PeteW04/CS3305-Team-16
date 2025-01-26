import User from "../models/User";
import Organization from "../models/Organization";
import { hashPassword, checkPassword } from "../utils/passwordHash";

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

        const token = jwt.sign({ id: manager._id, role: manager.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.status(201).json({ token })
    } catch (e) {
        console.error("Error in registerManager:", e.message);
        res.status(500).json({ message: e.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "User does not exist" });
        }

        const correctPassword = await checkPassword(password, user.password);
        if (!correctPassword) {
            return res.status(400).send({ message: "Invalid Password" })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ token });
    } catch (e) {
        console.error("Login Error", e.message);
        res.status(500).json({ message: e.message });
    }
};