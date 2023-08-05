import React, { useRef, useState } from "react";
import axios from "axios";

export default function ImageUpload() {
  const fileInput = useRef(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  function previewImageFunction() {
    const file = fileInput.current.files[0];
    const formData = new FormData();
    formData.append('image', file);

    // Read and preview the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload the file
    axios.post('http://localhost:3000/uploads', formData)
      .then((response) => {
        alert('File uploaded successfully!');
        setUploadedFilePath(response.data.filePath);
      })
      .catch((error) => alert('An error occurred while uploading the file: ' + error));
  }

  function addSecretMessage() {
    if (uploadedFilePath) {
      const secretMessage = prompt('Please enter the secret message:');
      axios.post(`http://localhost:3000/add-message`, { filePath: uploadedFilePath, message: secretMessage })
        .then(() => {
          alert('Secret Message Added Successfully!');
        })
        .catch((error) => alert('An error occurred while adding the message: ' + error));
    } else {
      alert('Please preview a file first.');
    }
  }

  function getSecretMessage() {
    if (uploadedFilePath) {
      axios.get(`http://localhost:3000/get-message/${uploadedFilePath}`)
        .then((response) => {
          alert('Secret Message: ' + response.data.message);
        })
        .catch((error) => alert('An error occurred while getting the message: ' + error));
    } else {
      alert('Please preview a file first.');
    }
  }

  return (
    <>
      <form>
        <input type="file" id="imageUpload" accept="image/*" ref={fileInput} />
        <button type="button" onClick={previewImageFunction}>Preview & Upload</button>
        <button type="button" onClick={addSecretMessage}>Add Secret Message</button>
        <button type="button" onClick={getSecretMessage}>Get Secret Message</button>
      </form>
      {previewURL && <img id="preview" src={previewURL} alt="Image preview" />} {/* Updated line */}
    </>
  );
}

