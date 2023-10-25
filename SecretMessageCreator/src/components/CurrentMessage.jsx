import React, { useState } from "react";
import axios from "axios";

// Used to get the message currently embedded in the image
export default function CurrentMessage() {
    // The useState hook add state to allow the message to be set
    const [message, setMessage] = useState("");

    // Get call to get the message of the first image
    function fetchMessage() {
        axios.get('http://localhost:3000/get-first-image-message')
            .then(response => {
                // Call to set message to update the page with the message
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error("Error fetching the message: ", error);
            });
    }

    return(
        <div className="current-message-container">
            <button type="button" className="current-message-button"onClick={fetchMessage}>Reveal Current Message</button>
            <textarea readOnly className="current-message" placeholder="Current message is..." value={message}></textarea>
        </div>
    );
}