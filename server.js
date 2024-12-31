const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
// Initialize the app
const app = express();

// Use the port from the environment variable (Render provides this)
const PORT = process.env.PORT || 4000;

const allowedOrigin = 'https://portfolio-db-7fbd.onrender.com';

const corsOptions = {
    origin: allowedOrigin,  // Allow only your React app
    methods: 'GET,POST',     // You can specify allowed methods
    allowedHeaders: 'Content-Type,Authorization',  // Add any custom headers here
  };

  app.use(cors(corsOptions));

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(process.env.DB_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Successfully connected to MongoDB');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});


// API endpoint to export Project data from MongoDB

const Projects = mongoose.model('Projects', new mongoose.Schema({}, { strict: false }));
app.get('/api/v1/projects', async (req, res) => {
    try {
        const projects = await Projects.find(); 
        res.json(projects); // Send the data as JSON
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data', error: err.message });
    }
});

// API endpoint to export stack data from MongoDB

const tech_stack = mongoose.model('tech_stack', new mongoose.Schema({}, { strict: false }));

app.get('/api/v1/stacks', async (req, res) => {
    try {
        const stacks = await tech_stack.find(); 
        res.json(stacks); // Send the data as JSON
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data', error: err });
    }
});

// API endpoint to export skills data from MongoDB

const all_skills = mongoose.model('skills', new mongoose.Schema({}, { strict: false }));

app.get('/api/v1/skills', async (req, res) => {
    try {
        const skills = await all_skills.find(); 
        res.json(skills); // Send the data as JSON
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data', error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
