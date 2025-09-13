// src/pages/RumtekTour.jsx
import React, { useEffect, useState } from "react";
import "aframe"; // ensure A-Frame is available globally
import scenesData from "../data/scenes.json";
import "../styles/rumtek.css"; // your CSS (see below)

const RumtekTour = () => {
  const [currentSceneKey, setCurrentSceneKey] = useState(scenesData.defaultScene);

  // Register A-Frame "clickable" component once
  useEffect(() => {
    if (typeof window.AFRAME === "undefined") {
      console.error("AFRAME not loaded. Make sure 'aframe' is imported.");
      return;
    }

    // Register only if not already registered
    if (!window.AFRAME.components || !window.AFRAME.components.clickable) {
      window.AFRAME.registerComponent("clickable", {
        init: function () {
          this.el.addEventListener("click", () => {
            const target = this.el.getAttribute("data-scene");
            if (target) {
              // update React state (change scene)
              // use setTimeout to avoid A-Frame internal race conditions
              setTimeout(() => setCurrentSceneKey(target), 0);
            }
          });
        },
      });
    }
  }, []);

  const sceneObj = scenesData.scenes[currentSceneKey];

  if (!sceneObj) {
    return <div style={{ padding: 40 }}>Scene not found: {currentSceneKey}</div>;
  }

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        loading-screen="enabled: true"
        cursor="rayOrigin: mouse"
        raycaster="objects: [clickable]"
        style={{ height: "100vh", width: "100%" }}
      >
        <a-assets>
          {/* Preload all scene images from JSON */}
          {Object.keys(scenesData.scenes).map((key) => {
            const s = scenesData.scenes[key];
            return <img key={key} id={key} src={s.image} alt={s.title} />;
          })}

          {/* Preload any hotspot icons if used - we use icon path from hotspot */}
          {/* We can also preload a single arrow if wanted */}
          <img id="arrow-icon" src="/rumtek-assets/arrow-forward.svg" alt="arrow" />
        </a-assets>

        {/* Use the sceneObj.image as src (URL like /rumtek-assets/rumtek1.jpg) */}
        <a-sky id="skybox" src={sceneObj.image} rotation="0 -130 0"></a-sky>

        {/* Render hotspots for the current scene */}
        {sceneObj.hotspots &&
          sceneObj.hotspots.map((hs) => {
            // fallback icon if missing
            const iconSrc = hs.icon || "/rumtek-assets/arrow-forward.svg";
            return (
              <a-image
                key={hs.id}
                src={iconSrc}
                position={hs.position}
                scale={hs.scale || "0.8 0.8 0.8"}
                clickable
                data-scene={hs.target}
                geometry="primitive: plane"
                material="transparent: true; opacity: 0.95"
              ></a-image>
            );
          })}

        <a-entity camera look-controls wasd-controls position="0 1.6 0"></a-entity>
      </a-scene>

      {/* Simple overlay UI */}
      <div id="rumtek-ui">
        <div className="ui-inner">
          <h3>{sceneObj.title}</h3>
          <p>{sceneObj.info}</p>
          <div className="ui-buttons">
            <button
              onClick={() => setCurrentSceneKey(scenesData.defaultScene)}
            >
              Back to Entrance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RumtekTour;
