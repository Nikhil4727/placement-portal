// import path from 'path';
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import jwt from 'jsonwebtoken';



// const app = express();

// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/IDP")
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // User Schema and Model
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model('Admin', userSchema, 'admin');

// // Authentication Middleware
// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, "nikhil"); // Use your JWT secret
//     const user = await User.findOne({ _id: decoded._id });

//     if (!user) {
//       return res.status(401).send({ error: 'Please authenticate.' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: 'Please authenticate.' });
//   }
// };

// // Admin Dashboard Route (Protected by the auth middleware)
// app.get('/api/admin-dashboard', auth, (req, res) => {
//   res.send({ message: 'Welcome Admin!', admin: req.user });
// });

// // Signup Route (No password hashing)
// app.post('/api/signup', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = new User({
//       username,
//       password,
//     });

//     await user.save();

//     const token = jwt.sign(user._id.toString(), "nikhil");
//     res.status(201).send({ user, token });
//   } catch (error) {
//     res.status(400).send({ error: 'Signup failed. Please try again.' });
//   }
// });

// // Login Route (without bcrypt)
// app.post('/api/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(400).send({ error: 'Unable to login. User not found.' });
//     }

//     if (password !== user.password) {
//       return res.status(400).send({ error: 'Unable to login. Incorrect password.' });
//     }

//     const token = jwt.sign({ _id: user._id.toString() }, "nikhil");
//     res.send({ user, token });
//   } catch (error) {
//     res.status(400).send({ error: 'Unable to login.' });
//   }
// });

// // Performance Routes
// app.post('/api/add-performance', auth, async (req, res) => {
//   try {
//     const { year, section, title, topics } = req.body;
//     const performance = new Performance({ year, section, title, topics });
//     await performance.save();
//     res.status(201).send(performance);
//   } catch (error) {
//     res.status(400).send({ error: 'Failed to add performance.' });
//   }
// });

// app.put('/api/update-performance/:id', auth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, topics } = req.body;
//     const performance = await Performance.findByIdAndUpdate(id, { title, topics }, { new: true });
//     res.send(performance);
//   } catch (error) {
//     res.status(400).send({ error: 'Failed to update performance.' });
//   }
// });

// app.delete('/api/delete-performance/:id', auth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Performance.findByIdAndDelete(id);
//     res.send({ message: 'Performance deleted successfully.' });
//   } catch (error) {
//     res.status(400).send({ error: 'Failed to delete performance.' });
//   }
// });

// app.get('/api/performances', auth, async (req, res) => {
//   try {
//     const performances = await Performance.find();
//     res.send(performances);
//   } catch (error) {
//     res.status(400).send({ error: 'Failed to fetch performances.' });
//   }
// });

// // Question Routes
// app.post('/api/add-question', auth, async (req, res) => {
//   try {
//     const { year, section, topic, question, platform } = req.body;
//     const newQuestion = new Question({ year, section, topic, question, platform });
//     await newQuestion.save();
//     res.status(201).send(newQuestion);
//   } catch (error) {
//     res.status(400).send({ error: 'Failed to add question.' });
//   }
// });

// app.get('/api/questions', auth, async (req, res) => {
//   try {
//     const questions = await Question.find();
//     res.send(questions);
//   } catch (error) {
//     res.status(400).send({ error: 'Failed to fetch questions.' });
//   }
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Static folder serve

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/IDP")
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('Admin', userSchema, 'admin');

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, "nikhil"); // Use your JWT secret
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

// Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// File Upload Route (Protected)
app.post("/api/upload", auth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "File upload failed." });
  }
  res.send({ 
    message: "File uploaded successfully", 
    filename: req.file.filename,
    filePath: `/uploads/${req.file.filename}`
  });
});

// Admin Dashboard Route
app.get('/api/admin-dashboard', auth, (req, res) => {
  res.send({ message: 'Welcome Admin!', admin: req.user });
});

// Signup Route (No password hashing)
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
    res.status(400).send({ error: 'Signup failed. Please try again.' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send({ error: 'Unable to login. User not found.' });
    }

    if (password !== user.password) {
      return res.status(400).send({ error: 'Unable to login. Incorrect password.' });
    }

    const token = jwt.sign({ _id: user._id.toString() }, "nikhil");
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Unable to login.' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
