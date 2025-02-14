import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));
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

// File Schema and Model
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  year: { type: String, required: true },
  section: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  uploadedAt: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

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

// Initialize GridFSBucket
let bucket;
const conn = mongoose.connection;
conn.once('open', () => {
  const db = conn.db;
  bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  console.log('GridFSBucket initialized');
});

// Multer Setup for File Upload
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// File Upload Route (Protected)
app.post("/api/upload", auth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded." });
  }

  try {
    const { year, section } = req.body;

    if (!year || !section) {
      return res.status(400).send({ error: "Year and section are required." });
    }

    // Create a write stream to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        year,
        section,
        uploadedBy: req.user._id,
      },
    });

    // Write the file buffer to GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      const file = new File({
        filename: req.file.originalname,
        filePath: `/api/file/${req.file.originalname}`,
        year,
        section,
        uploadedBy: req.user._id,
      });

      await file.save();

      res.status(200).send({
        message: "File uploaded and metadata saved successfully",
        file: {
          filename: file.filename,
          filePath: file.filePath,
          year: file.year,
          section: file.section,
          uploadedAt: file.uploadedAt,
        },
      });
    });

    uploadStream.on('error', (err) => {
      console.error("Error uploading file to GridFS:", err);
      res.status(500).send({ error: "Failed to upload file." });
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ error: "Failed to upload file." });
  }
});



app.get("/api/files", auth, async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id }).sort({ uploadedAt: -1 });
    console.log("Fetched files from MongoDB:", files); // Log the fetched files
    res.send(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send({ error: "Failed to fetch files." });
  }
});





// File Download Route
app.get("/api/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const downloadStream = bucket.openDownloadStreamByName(filename);

  downloadStream.on('file', (file) => {
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
  });

  downloadStream.on('error', (err) => {
    console.error("File download error:", err);
    res.status(404).send({ error: "File not found." });
  });

  downloadStream.pipe(res);
});



//view file
app.get('/view/:filename', async (req, res) => {
  try {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
      const file = await bucket.find({ filename: req.params.filename }).toArray();

      if (!file || file.length === 0) {
          return res.status(404).json({ error: 'File not found' });
      }

      res.set('Content-Type', 'application/pdf');
      bucket.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (err) {
      res.status(500).json({ error: 'Error retrieving file' });
  }
});



//dlt file
app.delete("/api/file/:filename", auth, async (req, res) => {
  try {
    const filename = req.params.filename;

    // Find the file metadata in MongoDB
    const file = await File.findOne({ filename });

    if (!file) {
      return res.status(404).send({ error: "File not found." });
    }

    // Delete the file from GridFS
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const files = await bucket.find({ filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).send({ error: "File not found in GridFS." });
    }

    await bucket.delete(files[0]._id);

    // Delete the file metadata from MongoDB
    await File.deleteOne({ filename });

    res.status(200).send({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send({ error: "Failed to delete file." });
  }
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