import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import sikkimExploreImg from "../assets/sikkim-explore.jpg";
import travelBg from "../assets/sikkim-background.jpg"; // ✅ background for Travel Tools
import virtualguideBg from "../assets/virtualguide.jpeg"; // ✅ background for Virtual Guide

import manuscript1 from "../assets/manuscript1.jpg";
import manuscript2 from "../assets/manuscript2.jpg";
import manuscript3 from "../assets/manuscript3.jpg";

import { Link } from "react-router-dom";

// Static data of monasteries (still for search bar popups)
const monasteries = [
  {
    name: "Rumtek Monastery",
    info: "Rumtek is one of the largest monasteries in Sikkim, known for its golden stupa and Tibetan architecture."
  },
  {
    name: "Pemayangtse Monastery",
    info: "Over 300 years old, Pemayangtse offers stunning views of Kanchenjunga and holds rich cultural history."
  },
  {
    name: "Tashiding Monastery",
    info: "Famous for its holy water ceremony, Tashiding is situated atop a hill offering peace and spirituality."
  },
  {
    name: "Enchey Monastery",
    info: "Located near Gangtok, Enchey is known for its sacredness and annual Cham dance festival."
  },
  {
    name: "Phodong Monastery",
    info: "Built in the 18th century, Phodong is a key monastery of the Kagyu sect, known for its vibrant murals."
  }
];

const Explore = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  // ✅ Smooth scrolling
  useEffect(() => {
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }, []);

  const handleSearch = () => {
    const found = monasteries.find(
      (m) => m.name.toLowerCase() === query.toLowerCase()
    );
    if (found) {
      setResult(found);
    } else {
      setResult({
        name: "Not Found",
        info: "Monastery not found. Try Rumtek, Pemayangtse, Tashiding, Enchey, or Phodong."
      });
    }
  };

  return (
    <div className="explore-page">
      {/* Navbar */}
     <nav className="navbar">
  <div className="navbar-left">
    <span className="small-text">experience</span>
    <span className="brand">Monastery 360</span>
  </div>

  <div className="navbar-center">
    <ul>
      {/* ✅ Correct navigation */}
      <li><Link to="/">Home</Link></li>
      <li><Link to="/explore">Explore</Link></li>

      {/* ✅ New Manuscripts option (scrolls to section) */}
      <li><a href="#manuscripts">Manuscripts</a></li>
      <li><a href="#virtual-guide">Virtual Guide</a></li>
      <li><a href="#travel-tools">Travel Guide</a></li>
    </ul>
  </div>

  <div className="navbar-right">
    <button className="icon-btn" aria-label="Search" onClick={() => navigate("/explore")}>🔍</button>
    <button className="icon-btn" aria-label="Saved">♡</button>
    <button className="icon-btn" aria-label="Map" onClick={() => navigate("/interactive-map")}>🗺️</button>
    <button className="lang-btn" aria-label="Language">En</button>
  </div>
</nav>


      {/* Section 1 (Hero + Search Bar) */}
      <section
        id="explore-hero"
        className="explore-hero"
        style={{ backgroundImage: `url(${sikkimExploreImg})` }}
      >
        <div className="overlay">
          <div className="hero-content">
            <div className="explore-top-text">
              <p>Step inside the spiritual heart of Sikkim. Search monasteries, learn their stories, and experience their beauty — all in one place.”</p>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search Monastery..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 (Virtual Guide) */}
      <section id="virtual-guide" className="virtual-guide" style={{ backgroundImage: `url(${virtualguideBg})` }}>
        <h2 className="guide-title">Virtual Guide</h2>
        <div className="guide-cards">
          {/* Card 1 */}  
<div className="guide-card">
  <div className="card-content">
    <h3>Virtual Tour</h3>
    <p>
      Step into the serene world of Sikkim’s monasteries. Explore centuries-old
      architecture, murals, and spiritual spaces — all from the comfort of your screen.
    </p>
  </div>
  <div className="card-hover">
    {/* 👇 Open blank tab */}
    <button onClick={() => window.open("/virtual-tour", "_blank")}>
      Start Virtual Tour
    </button>
  </div>
</div>


          {/* Card 2 */}
          <div className="guide-card">
            <div className="card-content">
              <h3>Smart Audio Guide</h3>
              <p>
                Experience the monasteries with your own personal storyteller. Our Smart Audio Guide
                brings legends, rituals, and history to life — synchronized with your virtual tour.
              </p>
            </div>
              <div className="card-hover">
  <button
    onClick={() => window.open("/audio-guide", "_blank")}
  >
    Start Audio Guide
  </button>
</div>

          </div>
        </div>
      </section>

      {/* Section 3 (Travel Tools) */}
      <section
        id="travel-tools"
        className="travel-tools"
        style={{
          backgroundImage: `url(${travelBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <h2 className="tools-title">Your Travel Guide</h2>
        <div className="tools-grid">
          {/* Card 1 */}
          <div className="tool-card">
            <div className="card-content">
              <h3>Travel Planner</h3>
              <p>
                Plan your journey with ease — from monastery visits to hidden trails, 
                create a seamless itinerary tailored to your interests.
              </p>
            </div>
            <div className="card-hover">
              <button>Explore</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="tool-card">
            <div className="card-content">
              <h3>Interactive Map</h3>
              <p>
                Explore with our smart, interactive map. Discover routes, nearby attractions, 
                and customize your tour in real time.
              </p>
            </div>
            <div className="card-hover">
              <button onClick={() => window.open("/interactive-map", "_blank")}>
      Explore
    </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="tool-card">
            <div className="card-content">
              <h3>Transport & Tourist Information</h3>
              <p>
                Find the best travel options across Sikkim. From taxis to guided tours, 
                enjoy safe and convenient transport at every step.
              </p>
            </div>
            <div className="card-hover">
              <button>Explore</button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="tool-card">
            <div className="card-content">
              <h3>Booking</h3>
              <p>
                Get all the details you need — events, stays, permits, and easy online bookings — 
                everything in one place.
              </p>
            </div>
            <div className="card-hover">
              <button>Explore</button>
            </div>
          </div>
        </div>
      </section>

      <section className="manuscripts-section"  id="manuscripts">
  <h2 className="manuscripts-title">Manuscripts</h2>

  <div className="manuscript-cards">
    {/* Manuscript 1 */}
    <div className="manuscript-card long-card">
      <div className="card-img">
        <img src={manuscript1} alt="Namthar of Lhatsun Chenpo" />
      </div>
      <div className="card-desc">
        <h4>Namthar of Lhatsun Chenpo</h4>
        <p>
          A spiritual biography chronicling the journey of Lhatsun Chenpo and
          the establishment of Dubdi Monastery.
        </p>
      </div>
    </div>

    {/* Manuscript 2 */}
    <div className="manuscript-card long-card">
      <div className="card-img">
        <img src={manuscript2} alt="Chos-rTsa-ba Religious Histories" />
      </div>
      <div className="card-desc">
        <h4>Chos-rTsa-ba</h4>
        <p>
          Religious histories documenting the Buddhist spread, sacred rituals,
          and cultural synthesis in Sikkim.
        </p>
      </div>
    </div>

    {/* Manuscript 3 */}
    <div className="manuscript-card long-card">
      <div className="card-img">
        <img src={manuscript3} alt="Lepcha Manuscripts" />
      </div>
      <div className="card-desc">
        <h4>Lepcha Manuscripts</h4>
        <p>
          Indigenous Rong-script texts capturing folklore, tribal myths,
          medicinal knowledge, and local governance.
        </p>
      </div>
    </div>
  </div>

  {/* Second Row Tool Cards */}
  <div className="manuscript-tools">
    <div className="tool-card">
      <div className="card-content">
        <h3>Upload Images of Manuscripts</h3>
        <p>
          Share an image of ancient monastery manuscripts, and our system will
          recognize and preserve the text digitally.
        </p>
      </div>
      <div className="card-hover">
        <button>Upload</button>
      </div>
    </div>

    <div className="tool-card">
      <div className="card-content">
        <h3>Translate Manuscripts</h3>
        <p>
          Instantly translate manuscripts into multiple languages, making
          centuries of wisdom accessible to everyone.
        </p>
      </div>
      <div className="card-hover">
        <button>Translate</button>
      </div>
    </div>
  </div>
</section>


      {/* Popup Modal */}
      {result && (
        <div className="modal-overlay" onClick={() => setResult(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{result.name}</h2>
            <p>{result.info}</p>
            <button className="close-btn" onClick={() => setResult(null)}>Close</button>
          </div>
        </div>
      )}
      <footer className="footer">
        <p>© 2025 Monastery360. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Explore;
