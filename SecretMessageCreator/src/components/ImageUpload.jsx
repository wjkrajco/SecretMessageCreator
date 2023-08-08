import React, { useRef, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // Ensuring credentials (like cookies) are sent with every request made by axios

export default function ImageUpload() {
  const fileInput = useRef(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  function previewImageFunction() {
    const file = fileInput.current.files[0];

    if (!file) {
      alert("Please choose a file before uploading.");
      return; // exit the function early if no file selected
    }
    
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

  return (
    <>
      <form>
        <input type="file" id="imageUpload" accept="image/*" ref={fileInput} />
        <button type="button" onClick={previewImageFunction}>Preview & Upload</button>
      </form>
      {previewURL && <img id="preview" src={previewURL} alt="Image preview" />}
    </>
  );
}

