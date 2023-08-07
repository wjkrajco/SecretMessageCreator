import React from "react"


export default function AddSecretMessage() {
    // Function to handle the click event
    const handleClick = () => {
        const inputValue = document.getElementById("secretmessage-box").value;
        alert(inputValue);
    }

    return (
        <div>
            <textarea rows="5" cols="20" id="secretmessage-box">
                Hello
            </textarea>
            <button type="button" id="secretmessage-button" onClick={handleClick}>Upload Secret Message</button>
        </div>
    );
}