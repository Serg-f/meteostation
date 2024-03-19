import React, { useEffect } from "react";
import BaseLayout from "./BaseLayout";
import seaImage from "../img/sea.jpg"; // Import the image directly
import seaSound from "../mp3/sea.mp3";

const Sea = () => {
  // Effect to change the background and clean up when the component unmounts
  useEffect(() => {
    // Store the original background to restore it later
    const originalBackground = document.body.style.backgroundImage;

    // Set the new background image for the Sea page
    document.body.style.backgroundImage = `url(${seaImage})`;

    // Cleanup function to reset the background when the component unmounts
    return () => {
      document.body.style.backgroundImage = originalBackground;
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <BaseLayout>
      <audio src={seaSound} autoPlay loop />
    </BaseLayout>
  );
};

export default Sea;
