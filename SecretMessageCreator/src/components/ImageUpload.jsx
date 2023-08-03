import React, { useRef, useState } from "react";
import axios from "axios";

export default function ImageUpload() {
  const fileInput = useRef(null);
  const previewImage = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  function previewImageFunction() {
    if (fileInput.current.files && fileInput.current.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.current.src = e.target.result;
            previewImage.current.style.display = "block";
        };

        reader.readAsDataURL(fileInput.current.files[0]);
    }
}


function handleUpload() {
    const file = fileInput.current.files[0];
    const formData = new FormData();
    formData.append('image', file);

    axios.post('http://localhost:3000/upload', formData)
      .then((response) => {
        alert('File uploaded successfully!');
        setUploadedFileName(file.name);
      })
      .catch((error) => alert('An error occurred while uploading the file: ' + error));
  }

  function getMessage() {
    if (uploadedFileName) {
      axios.get(`http://localhost:3000/read-message/${uploadedFileName}`)
        .then((response) => {
          alert('Secret Message: ' + response.data.message);
        })
        .catch((error) => alert('An error occurred while reading the message: ' + error));
    } else {
      alert('Please upload a file first.');
    }
  }

  return (
    <>
      <form>
        <input type="file" id="imageUpload" accept="image/*" ref={fileInput} />
        <button type="button" onClick={previewImageFunction}>Preview</button>
        <button type="button" onClick={handleUpload}>Upload</button>
        <button type="button" onClick={getMessage}>Get Secret Message</button>
      </form>
      <img id="preview" src="" alt="Image preview" ref={previewImage} />
    </>
  );
}

