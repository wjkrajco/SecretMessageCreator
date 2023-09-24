import { useState } from 'react'
import CurrentMessage from "./components/CurrentMessage.jsx"
import AddSecretMessage from "./components/AddSecretMessage"
import ImageUpload from "./components/ImageUpload.jsx"
import './App.css'
import ImageDownload from "./components/ImageDownload.jsx"
import Nav from "./components/Nav.jsx"


function App() {
  return (
    <>

      
      <div className="container">
        <Nav />
        <ImageUpload />

        <AddSecretMessage />
        <CurrentMessage />
        
        <ImageDownload />

        <p className="credit">William Krajcovic 2023</p>
      </div>
    </>
  )
}

export default App
