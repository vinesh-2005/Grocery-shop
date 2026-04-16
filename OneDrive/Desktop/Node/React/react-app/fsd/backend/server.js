import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initSocket } from './socket.js';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import productRequestRoutes from './routes/productRequestRoutes.js';
import path from 'path';
dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

io.on('connection', (socket) => {
  console.log('Client connected to socket:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Grocery API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/requests', productRequestRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log('Backend connected successfully and listening for requests.');
});
// Trigger nodemon restart 3
// Trigger nodemon restart 1
