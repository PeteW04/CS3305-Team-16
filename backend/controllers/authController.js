import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Invite from "../models/Invite.js";
import { hashPassword, checkPassword } from "../utils/passwordHash.js";


export const registerManager = async (req, res) => {
    const { firstName, lastName, email, password, organizationName, description } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const organization = await Organization.create({ name: organizationName, description });

        const manager = await User.create({ firstName, email, lastName, password: hashedPassword, role: "manager", organizationId: organization._id });

        organization.employees.push(manager._id);
        organization.owner = manager._id;

        await organization.save();

        const token = jwt.sign({ id: manager._id, role: manager.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return res.status(201).json({
            token,
            user: {
                id: manager._id,
                firstName: manager.firstName,
                lastName: manager.lastName,
                email: manager.email,
                role: manager.role,
            },
        });
    } catch (e) {
        console.error("Error in registerManager:", e.message);
        return res.status(500).json({ message: e.message });
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

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (e) {
        console.error("Login Error", e.message);
        return res.status(500).json({ message: e.message });
    }
};


export const registerEmployee = async (req, res) => {
    const { firstName, lastName, password, token } = req.body;

    try {
        const invite = await Invite.findOne({ token });
        if (!invite) {
            return res.status(400).json({ message: "Invite does not exist" });
        }
        if (invite.expires < new Date()) {
            return res.status(400).json({ message: "Invite expired" });
        }
        const hashedPassword = await hashPassword(password);
        const organizationId = invite.organizationId;
        const organization = await Organization.findById(organizationId)
        const email = invite.email;

        const employee = await User.create({ firstName, lastName, email, password: hashedPassword, role: "employee", organizationId });

        organization.employees.push(employee._id);
        await organization.save();

        const authToken = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return res.status(201).json({
            authToken,
            user: {
                id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                role: employee.role,
            },
        });
    } catch (e) {
        console.error("Error in registerEmployee:", e.message);
        return res.status(500).json({ message: e.message });
    }
};


export const validateToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        return res.status(200).json(user);
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
