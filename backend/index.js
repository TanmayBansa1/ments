const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Mentorship Matching Platform API is running.' });
});

app.use('/api', authRoutes);
app.use('/api', profileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
