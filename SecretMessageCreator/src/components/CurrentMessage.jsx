import React, { useState } from "react";
import axios from "axios";

export default function CurrentMessage() {
    const [message, setMessage] = useState("");

    function fetchMessage() {
        axios.get('http://localhost:3000/get-first-image-message')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error("Error fetching the message: ", error);
            });
    }

    return(
        <div className="current-message-container">
            <button type="button" onClick={fetchMessage}>Reveal Current Message</button>
            <p>{message}</p>
        </div>
    );
}