import React from "react";
import BaseLayout from "./BaseLayout";
import "../css/about.css";

const About = () => {
    return (
        <BaseLayout>
            <h1>hello world</h1>
            <div className="about">
                <a href="https://github.com/Serg-f" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#fff" }}>
                    https://github.com/Serg-f
                </a>
            </div>
        </BaseLayout>
    );
}

export default About;
