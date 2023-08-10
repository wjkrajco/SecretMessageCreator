import axios from "axios";

export default function AddSecretMessage() {
    // Function to handle the click event
    const addSecret = () => {
        const inputValue = document.getElementById("secretmessage-box").value;

        // Data to send to server
        const data = {
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

    const clearMessage = () => {
        axios.post('http://localhost:3000/clear-message')
            .then(response => {
                alert('Secret message cleared successfully!');
            })
            .catch(error => {
                alert('An error occurred: ' + error);
            });
    }

    return (
        <>
            <div className="add-secret-buttons-container">
                <button type="button" id="secretmessage-button" onClick={addSecret}>Attach Secret Message</button>
                <button type="button" id="clear-button" onClick={clearMessage}>Clear Secret Message</button>
                
            </div>
            <div className="add-secret-container-textarea">
                <textarea className="add-secret-textarea" placeholder="Attach message here..." id="secretmessage-box"></textarea>
            </div>
        </>
        
    );
}