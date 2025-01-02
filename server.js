const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
// Initialize the app
const app = express();

// Use the port from the environment variable (Render provides this)
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: '*', // Allow all origins
    methods: 'GET,POST', // Specify allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
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



app.use(express.json());

// Schema and Model for the data to upload
const CommentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    subject: String,
    comment: String,
    date: { type: Date, default: Date.now }, 
  });
  
  const Comment = mongoose.model('Comment', CommentSchema);
  
  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };
  
  
  app.post('/api/v1/comments', async (req, res) => {
    console.log(req.body);
    try {
      const { firstName, lastName, email, subject, comments } = req.body;
  
      // Check if all required fields are provided
      if (!firstName || !lastName || !email || !subject || !comments) {
        return res.status(400).send('All fields are required.')
      }
  
      // Validate email formatS
      if (!validateEmail(email)) {
        return res.status(400).send('Invalid email format.');
      }
  
      const newComment = new Comment({
        firstName,
        lastName,
        email,
        subject,
        comments,
      });
  
      const savedComment = await newComment.save();
      res.status(201).json(savedComment);
    } catch (error) {
      res.status(500).send('Error uploading comment: ' + error.message);
    }
  });


  

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
