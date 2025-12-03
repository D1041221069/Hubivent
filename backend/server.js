import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

import authRoutes from './routes/authRoutes.js';
app.use('/auth', authRoutes);

import categoryRoutes from './routes/categoryRoutes.js';
app.use('/categories', categoryRoutes);

import eventRoutes from './routes/eventRoutes.js';
app.use('/events', eventRoutes);

import rsvpRoutes from './routes/rsvpRoutes.js';
app.use('/rsvp', rsvpRoutes);

import bookmarkRoutes from './routes/bookmarkRoutes.js';
app.use('/bookmark', bookmarkRoutes);

import feedbackRoutes from './routes/feedbackRoutes.js';
app.use('/feedback', feedbackRoutes);

import presenceRoute from './routes/presenceRoute.js';
app.use('/attendance', presenceRoute);

import userEventRoutes from './routes/userRoutes.js';
app.use('/me', userEventRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});