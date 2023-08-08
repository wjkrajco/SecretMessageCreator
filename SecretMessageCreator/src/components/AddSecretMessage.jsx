import axios from "axios";

export default function AddSecretMessage({ imagePath }) {
    // Function to handle the click event
    const handleClick = () => {
        const inputValue = document.getElementById("secretmessage-box").value;

        // Data to send to server
        const data = {
            filePath: imagePath,
            message: inputValue
        };

        // Send POST request to the server
        axios.post('http://localhost:3000/add-message', data)
            .then(response => {
                alert('Secret message added successfully!');
            })
            .catch(error => {
                alert('An error occurred: ' + error);
            });
    }

    return (
        <div>
            <textarea rows="5" cols="20" id="secretmessage-box" defaultValue="Hello"></textarea>
            <button type="button" id="secretmessage-button" onClick={handleClick}>Upload Secret Message</button>
        </div>
    );
}