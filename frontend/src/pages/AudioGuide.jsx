import React, { useState } from "react";
import { FaUpload, FaMapMarkerAlt } from "react-icons/fa";
import "../App.css";
import bgImage from "../assets/Audio.jpeg"; // ✅ Import your background image

const AudioGuide = () => {
  const [location, setLocation] = useState("");

  return (
    <div
      className="audio-guide-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // ✅ makes background stylish while scrolling
        minHeight: "100vh",
        color: "black",
      }}
    >
      {/* Top Description */}
      <div className="audio-guide-header">
        <h2>Turn every moment into a guided journey.</h2>
        <p>
          With our Smart Audio Guide, you can either upload a photo of a location
          to hear its story, or simply share your current spot and receive
          immersive audio narration about the history, culture, and significance
          around you.
        </p>
      </div>

      {/* Cards */}
      <div className="audio-guide-cards-container">
        {/* Upload Image Card */}
        <div className="audio-guide-card-wrapper">
          <div className="circle-card gradient-purple with-border">
            <div className="card-inner">
              <FaUpload size={40} color="white" style={{ marginBottom: "1rem" }} />
              <p>
                Snap or upload a photo of any monastery or cultural site, and
                instantly hear its story come alive through guided audio.
              </p>
            </div>
            <div className="card-hover">
              <button>Upload Image</button>
            </div>
          </div>
          <h3 className="card-title">Upload an Image</h3>
        </div>

        {/* Location Audio Card */}
        <div className="audio-guide-card-wrapper">
          <div className="circle-card gradient-blue with-border">
            <div className="card-inner">
              <FaMapMarkerAlt
                size={40}
                color="white"
                style={{ marginBottom: "1rem" }}
              />
              <p>
                Simply share your location, and our guide will narrate the history,
                legends, and hidden gems of the place around you.
              </p>
              <input
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="location-input"
              />
            </div>
            <div className="card-hover">
              <button>Start Audio</button>
            </div>
          </div>
          <h3 className="card-title">Location Based Audio</h3>
        </div>
      </div>
    </div>
  );
};

export default AudioGuide;
