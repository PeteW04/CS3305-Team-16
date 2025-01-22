import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    }
    catch (e) {
        throw new Error('Error hashing password');
    }
}

export const checkPassword = async (password, hashedPassword) => {
    try {
        isCorrect = await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        throw new Error('Error verifying password');
    }
}

