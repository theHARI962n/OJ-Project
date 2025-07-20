// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db'); // 👈 Import DB
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); //Parse JSON body

// Connect MongoDB
connectDB();

// Routes
app.use('/api', authRoutes); 
app.use('/api/problems', problemRoutes);

app.post('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});
  

app.get('/', (req, res) => {
  res.send('API is workings 🚀');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
