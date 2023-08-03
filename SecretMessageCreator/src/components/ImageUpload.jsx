import React, { useRef } from "react";
import axios from "axios";

export default function ImageUpload() {
  const fileInput = useRef(null);
  const previewImage = useRef(null);

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
      .then(() => alert('File uploaded successfully!'))
      .catch((error) => alert('An error occurred while uploading the file: ' + error));
  }

  return (
    <>
      <form>
        <input type="file" id="imageUpload" accept="image/*" ref={fileInput} />
        <button type="button" onClick={previewImageFunction}>Preview</button>
        <button type="button" onClick={handleUpload}>Upload</button>
      </form>
      <img id="preview" src="" alt="Image preview" ref={previewImage} />
    </>
  );
}

