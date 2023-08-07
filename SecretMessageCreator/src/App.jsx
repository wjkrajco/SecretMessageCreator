import { useState } from 'react'
import CurrentMessage from "/home/wjkrajco/personalprojects/SecretMessageCreator/SecretMessageCreator/src/components/CurrentMessage.jsx"
import AddSecretMessage from "/home/wjkrajco/personalprojects/SecretMessageCreator/SecretMessageCreator/src/components/AddSecretMessage"
import ImageUpload from "/home/wjkrajco/personalprojects/SecretMessageCreator/SecretMessageCreator/src/components/ImageUpload.jsx"
import './App.css'


function App() {
  return (
    <>
      <CurrentMessage />
      <AddSecretMessage />
      <ImageUpload />
    </>
  )
}

export default App
