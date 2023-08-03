const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs')

const app = express();
const port = 3000;

app.use(cors());

// Configure storage
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB
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


// Handle file upload
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send({ error: err }); // Send error as JSON
    } else {
      const uploadedFilePath = path.join(__dirname, 'uploads', req.file.filename);
      const dataToAppend = Buffer.from([0x74, 0x65, 0x73, 0x74]); // 'test' in hexadecimal

      fs.appendFile(uploadedFilePath, dataToAppend, (err) => {
        if (err) {
          console.log('Error appending data:', err);
          res.status(500).send({ error: 'Failed to append data' });
        } else {
          console.log('Data appended successfully');
          res.send('File Uploaded and Data Appended Successfully!');
        }
      });
    }
  });
});

app.get('/read-message/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
  
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading file:', err);
        res.status(500).send({ error: 'Failed to read file' });
      } else {
        const eoiIndex = data.lastIndexOf(Buffer.from([0xFF, 0xD9]));
  
        if (eoiIndex !== -1) {
          const secretMessageBuffer = data.slice(eoiIndex + 2);
          const secretMessage = secretMessageBuffer.toString();
          res.send({ message: secretMessage });
        } else {
          res.status(404).send({ error: 'No secret message found' });
        }
      }
    });
  });
  
  // Add this code below your routes and before starting the server:
  app.use((err, req, res, next) => {
    console.error(err);
    res.header('Access-Control-Allow-Origin', '*'); // Add CORS header
    res.status(500).send({ error: 'An internal error occurred.' });
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });