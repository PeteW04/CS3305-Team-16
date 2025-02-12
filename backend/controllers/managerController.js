import crypto from 'crypto';
import Invite from "../models/Invite.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

export const inviteEmployee = async (req, res) => {
    const { email } = req.body;
    const organizationId = req.user.organizationId;
    const organization = await Organization.findById(organizationId);
    try {
        const doesUserExist = await User.findOne({ email });
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
            <p>You have been invited to join ${organization.name}'s workspace. Click the link below to accept the invitation:</p>
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