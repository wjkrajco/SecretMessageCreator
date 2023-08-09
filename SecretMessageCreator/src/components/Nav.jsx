import React from "react"

export default function Nav() {
    return(
        <div>
            <nav className="nav">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"/>
                <h2 className="nav-title">Secret Text Encoder</h2>
                <p>The project will allow you to embed text into an image</p>
                <p>The source code can be found  
                    <a href="https://github.com/wjkrajco/SecretMessageCreator" target="_blank">
                        <i class="fab fa-github"></i>
                    </a>
                </p>
            </nav>
        </div>
    ) 
}