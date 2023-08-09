import { useState } from 'react'
import CurrentMessage from "/home/wjkrajco/personalprojects/SecretMessageCreator/SecretMessageCreator/src/components/CurrentMessage.jsx"
import AddSecretMessage from "/home/wjkrajco/personalprojects/SecretMessageCreator/SecretMessageCreator/src/components/AddSecretMessage"
import ImageUpload from "/home/wjkrajco/personalprojects/SecretMessageCreator/SecretMessageCreator/src/components/ImageUpload.jsx"
import './App.css'
import ImageDownload from "/home/wjkrajco/personalprojects/SecretMessageCreator/SecretMessageCreator/src/components/ImageDownload.jsx"
import Nav from "/home/wjkrajco/personalprojects/SecretMessageCreator/SecretMessageCreator/src/components/Nav.jsx"


function App() {
  return (
    <>

      <Nav />
      <div className="container">
        <ImageUpload />
        <div className="image-background">
          <p>No Image Uploaded</p>
        </div>
        <CurrentMessage />
        <AddSecretMessage />
        <ImageDownload />
      </div>
    </>
  )
}

export default App
