import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'StudyShare API is running' });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
