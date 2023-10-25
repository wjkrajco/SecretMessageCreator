const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

// Used for security ensuring only communication to front end port
app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true
}));

// Configure storage
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    // Call back function used to upload unique name for file
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Configures multer to handle a file upload and expect image
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  // Filters files that should be accepted 
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// Checks if the file is valid for type and calls to multer to upload
function checkFileType(file, cb) {
  // Allowed extensions and ensures files types
  const filetypes = /jpeg|jpg|png|gif/;
  // Checks for the file extnesion and changes to lower case
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Checks against the allowed types
  const mimetype = filetypes.test(file.mimetype);

  // Call to multer to upload file assuming type is right
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

function getFirstImagePath(callback) {
  // Used to find upload directory
  const uploadDir = path.join(__dirname, 'uploads');
  
  // Read the directory to get filenames
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      // Calls to main call back function with error
      callback(err);
      return;
    }
    
    // Gets the image path 
    const imagePath = files.length > 0 ? path.join(uploadDir, files[0]) : null;
    callback(null, imagePath);
  });
}

// Handle file upload
app.post('/uploads', (req, res) => {
  // Multer middleware to upload file
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send({ error: err });
    } else {
      const uploadedFilePath = path.join(__dirname, 'uploads', req.file.filename);

      console.log('File uploaded successfully to', uploadedFilePath);
      // JSON object is sent back to the client
      res.send({ filePath: uploadedFilePath, message: 'File Uploaded Successfully!' });
    }
  });
});

app.get('/download', (req, res) => {
  getFirstImagePath((err, imagePath) => {
      if (err || !imagePath) {
          console.log('Error fetching the image path:', err);
          return res.status(404).send({ error: 'No files found in the uploads directory' });
      }

      // Set headers for file download
      res.setHeader('Content-Disposition', 'attachment; filename=image.jpg');
      res.setHeader('Content-Type', 'image/jpeg');

      // Use a read stream to serve the file
      const fileStream = fs.createReadStream(imagePath);
      fileStream.pipe(res);
  });
});

app.post('/clear-message', (req, res) => {
  getFirstImagePath((err, imagePath) => {
    if (err || !imagePath) {
      console.log('Error fetching the image path:', err);
      return res.status(404).send({ error: 'No files found in the uploads directory' });
    }

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.log('Error reading file:', err);
        return res.status(500).send({ error: 'Failed to read file' });
      }

      // Find the position of bytes FF D9
      const eoiIndex = data.lastIndexOf(Buffer.from([0xFF, 0xD9]));

      if (eoiIndex === -1) {
          return res.status(500).send({ error: 'No EOI marker found' });
      }

      // Create a new buffer: data up to FF D9
      const newBuffer = data.slice(0, eoiIndex + 2);

      // Write the new buffer back to the image file
      fs.writeFile(imagePath, newBuffer, (err) => {
        if (err) {
            console.log('Error writing to file:', err);
            return res.status(500).send({ error: 'Failed to write to file' });
        }

        console.log('Message cleared successfully');
        res.send({ message: 'Secret Message Cleared Successfully!' });
      });
    });
  });
});

// Clears all of the photos out of the uploads folder
app.post('/clear-uploads', (req, res) => {

  // Gets the path of the uploads
  const directoryPath = path.join(__dirname, 'uploads');

  // Reads whats in the uploads
  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          return res.status(500).send({ error: 'Unable to scan directory' });
      }
      
      // Removes all the files from the uploads path
      for (const file of files) {
          fs.unlink(path.join(directoryPath, file), err => {
              if (err) {
                  return res.status(500).send({ error: 'Failed to delete file ' + file });
              }
          });
      }

      res.send({ success: 'All files deleted successfully' });
  });
});

// Gets the message from the first image
app.get('/get-first-image-message', (req, res) => {
  getFirstImagePath((err, imagePath) => {
    if (err || !imagePath) {
      console.log('Error fetching the image path:', err);
      return res.status(404).send({ error: 'No files found in the uploads directory' });
    }

    // Reads the file from the given path
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.log('Error reading file:', err);
        return res.status(500).send({ error: 'Failed to read file' });
      }

      const eoiIndex = data.lastIndexOf(Buffer.from([0xFF, 0xD9]));

      // Takes out and sends the message
      if (eoiIndex !== -1) {
        const secretMessageBuffer = data.slice(eoiIndex + 2);
        const secretMessage = secretMessageBuffer.toString();
        res.send({ message: secretMessage });
      } else {
        // Error if there is no message
        res.status(404).send({ error: 'No secret message found' });
      }
    });
  });
});
  

app.post('/add-message', (req, res) => {
  const { message } = req.body;

  // Error if there is no message
  if (!message) {
      return res.status(400).send({ error: 'Message is required' });
  }

  getFirstImagePath((err, imagePath) => {
    if (err || !imagePath) {
      console.log('Error fetching the image path:', err);
      return res.status(404).send({ error: 'No files found in the uploads directory' });
    }

    // Reads the image at the path
    fs.readFile(imagePath, (err, data) => {
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
      fs.writeFile(imagePath, newBuffer, (err) => {
        if (err) {
            console.log('Error writing to file:', err);
            return res.status(500).send({ error: 'Failed to write to file' });
        }

        console.log('Message added successfully');
        res.send({ message: 'Secret Message Added Successfully!' });
      });
    });
  });
});

 // Managees access control through CORS and it allows access from any origin
 app.use((err, req, res, next) => {
    console.error(err.stack);
    res.header('Access-Control-Allow-Origin', '*');
    res.status(500).send({ error: 'An internal error occurred.' });
 });


  
  // Start the server
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });