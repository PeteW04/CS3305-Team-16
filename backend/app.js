import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRouter from './routers/authRouter.js';

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);


app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));