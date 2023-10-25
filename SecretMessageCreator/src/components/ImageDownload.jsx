import React, { useRef } from "react";
import axios from "axios";

// Used to allow the user to Download the image
export default function ImageDownload() {

  // This allows for the access of DOM elements directly
  const downloadRef = useRef(null);


  function download() {
    axios({
      url: 'http://localhost:3000/download',
      method: 'GET',
      responseType: 'blob', 
    })
    .then(response => {
      // Creates a url from the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Attach the url to the hook
      const link = downloadRef.current;

      // Uses a hidden anchor and click to allow for the download
      link.href = url;
      link.setAttribute('download', 'image.jpg'); 
      link.click();

      // Clear the uploads folder after downloading
      return axios.post('http://localhost:3000/clear-uploads');
    })
    .then(() => {
      console.log('Uploads directory cleared successfully.');
    })
    .catch(error => {
      console.error("Error: ", error);
    });
}



  return (
    <>
      <button className="download-button" type="button" onClick={download}>Download Image</button>
      <a style={{ display: "none" }} ref={downloadRef}>Download Link</a>
    </>
  )
}