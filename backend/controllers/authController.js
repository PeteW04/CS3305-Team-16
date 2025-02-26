import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import ResetToken from '../models/ResetToken.js';
import { hashPassword, checkPassword } from "../utils/passwordHash.js";
import { sendEmail } from "../utils/email.js";
import Invite from "../models/Invite.js";
import { createChannel } from "./messageController.js";

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


export const registerEmployee = async (req, res) => {
    const { firstName, lastName, password, token } = req.body;

    try {
        // Validate the invite
        const invite = await Invite.findOne({ token });
        if (!invite) {
            return res.status(400).json({ message: "Invite does not exist" });
        }

        if (invite.expires < new Date()) {
            return res.status(400).json({ message: "Invite expired" });
        }

        // Hash password and create employee
        const hashedPassword = await hashPassword(password);
        const organizationId = invite.organizationId; // Get organization ID from invite
        const organization = await Organization.findById(organizationId);
        const email = invite.email;

        const employee = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "employee",
            organizationId, // Assign employee to the same organization
        });

        // Add employee to organization
        organization.employees.push(employee._id);
        await organization.save();

        // Fetch all existing employees in the same organization (excluding the new employee)
        const existingEmployees = await User.find({
            organizationId: organization._id, // Filter by organization ID
            _id: { $ne: employee._id }, // Exclude the newly registered employee
        });

        // Create direct message channels between the new employee and all other employees in the same organization
        for (const existingEmployee of existingEmployees) {
            const channelData = {
                type: "direct-message",
                members: [employee._id, existingEmployee._id], // Include both members
                name: `${existingEmployee.firstName} ${existingEmployee.lastName}`, // Dynamic channel name
            };

            // Save channel to database (replace with your actual channel creation logic)
            await createChannel(
                { body: channelData, user: { id: employee._id } },
                { status: () => ({ json: () => { } }) },
            );
        }

        // Generate auth token for the new employee
        const authToken = jwt.sign(
            { id: employee._id, role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

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

        const token = jwt.sign({ id: user._id, role: user.role, organizationId: user.organizationId }, process.env.JWT_SECRET, { expiresIn: "7d" });

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


export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await ResetToken.create({
            userId: user._id,
            token: resetToken,
            expiresAt,
        });
        const resetLink = `http://localhost:3000/resetPassword?token=${resetToken}`;
        const subject = "Password Reset Request";
        const html = `
            <p>Hello,</p>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;
        await sendEmail(email, subject, html);

        return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error in forgotPassword:", error.message);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
};


export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const resetToken = await ResetToken.findOne({ token }).populate("userId");
        if (!resetToken || ResetToken.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const user = resetToken.userId;
        user.password = await hashPassword(newPassword);
        await user.save();
        await ResetToken.deleteOne({ _id: resetToken._id });
        return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
};