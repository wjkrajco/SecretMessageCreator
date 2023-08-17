const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

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

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

function checkFileType(file, cb) {
  // Allowed extensions and ensures files types
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

      console.log('File uploaded successfully to', uploadedFilePath);
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
  const directoryPath = path.join(__dirname, 'uploads');

  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          return res.status(500).send({ error: 'Unable to scan directory' });
      }
      
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

app.get('/get-first-image-message', (req, res) => {
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
});
  

app.post('/add-message', (req, res) => {
  const { message } = req.body;

  if (!message) {
      return res.status(400).send({ error: 'Message is required' });
  }

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