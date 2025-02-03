import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
const app = express()

app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/IDP")
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('Admin', userSchema, 'admin');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Admin Dashboard Route (Protected by the auth middleware)
app.get('/api/admin-dashboard', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Access denied. Admins only.' });
  }
  res.send({ message: 'Welcome Admin!', admin: req.user });
});

// Signup route (No password hashing)
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = new User({
      username,
      password,
    });

    await user.save();

    const token = jwt.sign(user._id.toString(), "nikhil");
    res.status(201).send({ user, token });

  } catch (error) {
    res.status(400).send(error);
  }
});

// Login route (without bcrypt)
app.post('/api/login', async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log("User found:", user);
    if (!user) {
      return res.status(400).send({ error: 'Unable to login. User not found.' });
    }

    if (password !== user.password) {
      console.log("Incorrect password");
      return res.status(400).send({ error: 'Unable to login. Incorrect password.' });
    }

    // if (user.role !== 'admin') {
    //   console.log("Unauthorized login attempt");
    //   return res.status(403).send({ error: 'Access denied. Admins only.' });
    // }

    const token = jwt.sign({ _id: user._id.toString() }, "nikhil");
    console.log("Login successful, token generated:", token);

    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Unable to login.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});