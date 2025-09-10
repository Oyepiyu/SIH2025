import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Explore from "./pages/Explore.jsx"; 
import VirtualTour from "./pages/VirtualTour.jsx"; // ✅ Import new page
import AudioGuide from "./pages/AudioGuide.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<App />} />

        {/* Explore Page */}
        <Route path="/explore" element={<Explore />} />

        {/* Virtual Tour Page */}
        <Route path="/virtual-tour" element={<VirtualTour />} />

        <Route path="/audio-guide" element={<AudioGuide />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
