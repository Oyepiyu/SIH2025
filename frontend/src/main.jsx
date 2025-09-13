import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Explore from "./pages/Explore.jsx"; 
import VirtualTour from "./pages/VirtualTour.jsx";
import AudioGuide from "./pages/AudioGuide.jsx";
import InteractiveMapPage from "./pages/InteractiveMapPage";
import RumtekTour from "./pages/RumtekTour";
import ScrollToTop from "./components/ScrollToTop"; // ✅ import here
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />   {/* ✅ This ensures smooth scroll on every route change */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/virtual-tour" element={<VirtualTour />} />
        <Route path="/audio-guide" element={<AudioGuide />} />
        <Route path="/interactive-map" element={<InteractiveMapPage />} />
        <Route path="/rumtek-tour" element={<RumtekTour />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
