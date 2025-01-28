import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Invite from "../models/Invite.js";
import { hashPassword, checkPassword } from "../utils/passwordHash.js";
import { sendEmail } from "../utils/email.js";


export const registerManager = async (req, res) => {
    const { firstName, lastName, email, password, organizationName, description } = req.body;
    console.log(req.body);

    try {
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const organization = await Organization.create({ name: organizationName, description });

        const manager = await User.create({ firstName, email, lastName, password: hashedPassword, role: "manager", organizationId: organization._id });

        organization.employees.push(manager._id);
        organization.owner = manager._id;

        await organization.save();

        const token = jwt.sign({ id: manager._id, role: manager.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return res.status(201).json({ token })
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

        return res.status(200).json({ token });
    } catch (e) {
        console.error("Login Error", e.message);
        return res.status(500).json({ message: e.message });
    }
};

export const inviteEmployee = async (req, res) => {
    const { email } = req.body;
    const organizationId = req.user.organizationId;
    const organization = Organization.findOne({ organizationId });

    try {
        const doesUserExist = User.findOne({ email });
        if (doesUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        const invite = await Invite.create({ email, token, expires, organizationId });
        const link = `http://localhost:3000/employeeSignup?token=${token}`
        const subject = `You have been invited to join ${organization.name}!`
        const html = `
            <p>Hello,</p>
            <p>You have been invited to join ${organization.names}'s workspace. Click the link below to accept the invitation:</p>
            <a href="${link}">Accept Invitation</a>
            <p>The link will expire in 7 days.</p>
        `
        await sendEmail(email, subject, html);

        return res.status(200).json({ message: "Invite sent successfully" });
    } catch (e) {
        console.error("Error adding employee: ", e.message);
        return res.status(500).json({ message: "Error adding employee" })
    }
}

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
        const organization = Organization.findOne({ organizationId })
        const email = invite.email;

        const employee = await User.create({ firstName, lastName, email, password: hashedPassword, role: "employee", organizationId });

        organization.employees.push(employee._id);
        await organization.save();

        const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return res.status(201).json({ token })
    } catch (e) {
        console.error("Error in registerManager:", e.message);
        return res.status(500).json({ message: e.message });
    }
};