// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');


const connectDB = require('./config/db'); // 👈 Import DB
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');
const aiReviewRoutes = require("./routes/aiReviewRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); //Parse JSON body

// Connect MongoDB
connectDB();

// Routes
app.use('/api', authRoutes); 
app.use('/api/problems', problemRoutes);
app.use('/api/submit', submissionRoutes);
app.use('/api', userRoutes);
app.use("/api", aiReviewRoutes);

app.post('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});
  

app.get('/', (req, res) => {
  res.send('API is workings 🚀');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
