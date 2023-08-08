const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs')

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5173', // Change this to the location of your frontend
  credentials: true
}));

// Configure storage
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});


// Configures express-sessions
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key', 
  resave: false, 
  saveUninitialized: true
}));

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

function getFirstImagePath(callback) {
  const uploadDir = path.join(__dirname, 'uploads');
  
  // Read the directory to get filenames
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      callback(err);
      return;
    }
    
    const imagePath = files.length > 0 ? path.join(uploadDir, files[0]) : null; // Get the path of the first file or null if no files
    callback(null, imagePath);
  });
}


// Handle file upload
app.post('/uploads', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send({ error: err }); // Send error as JSON
    } else {
      const uploadedFilePath = path.join(__dirname, 'uploads', req.file.filename);

      // If a previous file exists for this user's session, delete it
      if (req.session.currentFilePath) {
        fs.unlink(req.session.currentFilePath, err => {
          if (err) {
            console.error("Error deleting the previous file:", err);
          }
        });
      }

      // Update the user's session with the path of the newly uploaded file
      req.session.currentFilePath = uploadedFilePath;

      console.log('File uploaded successfully');
      res.send({ filePath: uploadedFilePath, message: 'File Uploaded Successfully!' });
    }
  });
});

app.get('/get-first-image-message', (req, res) => {
  // Check if there's a current file in the user's session
  if (!req.session.currentFilePath) {
      return res.status(404).send({ error: 'No file uploaded during this session' });
  }

  // Use the file path from the session
  const filePath = req.session.currentFilePath;

  fs.readFile(filePath, (err, data) => {
      if (err) {
          console.log('Error reading file:', err);
          return res.status(500).send({ error: 'Failed to read file' });
      }

      const eoiIndex = data.lastIndexOf(Buffer.from([0xFF, 0xD9]));

      if (eoiIndex !== -1) {
          const secretMessageBuffer = data.slice(eoiIndex + 2);
          const secretMessage = secretMessageBuffer.toString();
          res.send({ message: secretMessage });
      } else {
          res.status(404).send({ error: 'No secret message found' });
      }
  });
});
  

app.post('/add-message', (req, res) => {
  const { message } = req.body;

  if (!message) {
      return res.status(400).send({ error: 'Message is required' });
  }

  // Check if there's a current file in the user's session
  if (!req.session.currentFilePath) {
      return res.status(404).send({ error: 'No file uploaded during this session' });
  }

  // Use the file path from the session
  const filePath = req.session.currentFilePath;

  fs.readFile(filePath, (err, data) => {
      if (err) {
          console.log('Error reading file:', err);
          return res.status(500).send({ error: 'Failed to read file' });
      }

      // Find the position of bytes FF D9
      const eoiIndex = data.lastIndexOf(Buffer.from([0xFF, 0xD9]));

      if (eoiIndex === -1) {
          return res.status(500).send({ error: 'No EOI marker found' });
      }

      // Create a new buffer: data up to FF D9 + message
      const newBuffer = Buffer.concat([
          data.slice(0, eoiIndex + 2),
          Buffer.from(message)
      ]);

      // Write the new buffer back to the image file
      fs.writeFile(filePath, newBuffer, (err) => {
          if (err) {
              console.log('Error writing to file:', err);
              return res.status(500).send({ error: 'Failed to write to file' });
          }

          console.log('Message added successfully');
          res.send({ message: 'Secret Message Added Successfully!' });
      });
  });
});

  // Add this code below your routes and before starting the server:
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.header('Access-Control-Allow-Origin', '*'); // Add CORS header
    res.status(500).send({ error: 'An internal error occurred.' });
});


  
  // Start the server
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });