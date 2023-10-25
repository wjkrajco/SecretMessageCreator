import React, { useRef, useState } from "react";
import axios from "axios";


export default function ImageUpload() {
  const fileInput = useRef(null);
  // State used to store the path of the file
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  // State used to store the data of the url for previewing
  const [previewURL, setPreviewURL] = useState(null);

  // Function to allow for image previewing
  const previewImageFunction = () => {

    // Gets the image from input
    const file = fileInput.current.files[0];

    if (!file) {
      alert("Please choose a file before uploading.");
      return;
    }
    
    // Adds the file to the form data
    const formData = new FormData();
    formData.append('image', file);

    // Read and preview the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };
    reader.readAsDataURL(file);

    // Clears all the files currently in the uploads folder
    axios.post('http://localhost:3000/clear-uploads')
        .then(() => {
            // Uploads the new image
            axios.post('http://localhost:3000/uploads', formData)
                .then((response) => {
                    alert('File uploaded successfully!');
                    setUploadedFilePath(response.data.filePath);
                })
                .catch((error) => alert('An error occurred while uploading the file: ' + error));
        })
        .catch((error) => {
            alert('An error occurred while clearing the uploads folder: ' + error);
        });
  };

  
  // The preview portion of the html is very important remeber the ternary operator is working
  // if if the previewURL is seen as true(I.E it has an image to preview) then it will render
  // the image as a preview, else it will render the div showing no Image
  return (
    <>
      <form>
        <input className="choose-file-button" type="file" id="imageUpload" accept="image/*" ref={fileInput} />
        <button type="button" onClick={previewImageFunction}>Preview & Upload</button>
      </form>

      {previewURL ? <img id="preview" src={previewURL} alt="Image preview" /> : 
        <div className="image-background">
            <p>No Image Uploaded</p>
        </div>
      }
    </>
  );
}
