import React, { useRef } from "react";
import axios from "axios";

export default function ImageDownload() {
  const downloadRef = useRef(null);


  

  function download() {
    axios({
      url: 'http://localhost:3000/download',
      method: 'GET',
      responseType: 'blob', 
    })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = downloadRef.current;
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