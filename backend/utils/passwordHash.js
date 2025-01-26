import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }
    catch (e) {
        console.error("Hash Password Error", e.message)
        throw new Error('Error hashing password');
    }
}

export const checkPassword = async (password, hashedPassword) => {
    try {
        isCorrect = await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        console.error("Check Password Error", e.message)
        throw new Error('Error verifying password');
    }
}

