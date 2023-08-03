import React from "react"
import { useRef } from "react"


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


    return(
        <>
            <img id="preview" src="" alt="Image preview" ref={previewImage}/>
            <form>
                <input type="file" id="imageUpload" accept="image/*" ref={fileInput}/>
                <button type="button" onClick={previewImageFunction}>Upload</button>
            </form>
            
            
        </>
    );
}


