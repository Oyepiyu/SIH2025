import React, { useEffect } from "react";
import "./App.css";

// Hero image
import heroImg from "./assets/sikkim-hero.jpg";

// Monastery images
import bgImage from "./assets/experience.jpeg";
import monastery1 from "./assets/monastery1.jpg";
import monastery2 from "./assets/monastery2.jpg";
import monastery3 from "./assets/monastery3.jpg";

// Plan Visit Images
import packagesImg from "./assets/packages.jpg";
import hotelsImg from "./assets/hotels.jpg";
import touristSpotsImg from "./assets/touristspots.jpg";
import monasteriesImg from "./assets/monasteries.jpg";
import heritageImg from "./assets/heritage.jpg";

export default function App() {
  const planCards = [
    { title: "Plan Your Visit", img: "", special: true },
    { title: "Packages", img: packagesImg },
    { title: "Hotels", img: hotelsImg, double: true },
    { title: "Tourist Spots", img: touristSpotsImg, double: true },
    { title: "Monasteries", img: monasteriesImg },
    { title: "Cultural Heritage", img: heritageImg },
  ];

  // Smooth scrolling for navbar
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

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <span className="small-text">experience</span>
          <span className="brand">Monastery 360</span>
        </div>

        <div className="navbar-center">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="/explore">Explore</a></li>
            <li><a href="#things">Things to do</a></li>
            <li><a href="#where">Where to go</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#plan">Plan your trip</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="navbar-right">
          <button className="icon-btn" aria-label="Search">🔍</button>
          <button className="icon-btn" aria-label="Saved">♡</button>
          <button className="icon-btn" aria-label="Map">🗺️</button>
          <button className="lang-btn" aria-label="Language">En</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="overlay">
          <div className="hero-content">
            <h3>Government of Sikkim</h3>
            <h1>Welcome to Monastery 360</h1>
            <a
              href="/explore"
              target="_blank"
              rel="noopener noreferrer"
              className="explore-link"
            >
              Start Exploring <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Experience Monasteries Section */}
      <section
  id="experience"
  className="monasteries-section"
  style={{ backgroundImage: `url(${bgImage})` }}
>
        <div className="container">
          <h2>Experience Monasteries in Sikkim</h2>
          <div className="monastery-row">
            
            {/* Card 1 */}
            <div className="monastery-card">
              <img src={monastery1} alt="Rumtek Monastery" />
              <div className="overlay"></div>
              <div className="info">
                <h3>Rumtek Monastery</h3>
                <p>
                  Known as the Dharma Chakra Centre, Rumtek is one of the largest
                  monasteries in Sikkim with stunning golden stupa and Tibetan
                  architecture.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="monastery-card">
              <img src={monastery2} alt="Pemayangtse Monastery" />
              <div className="overlay"></div>
              <div className="info">
                <h3>Pemayangtse Monastery</h3>
                <p>
                  This 300-year-old monastery overlooks the majestic Kanchenjunga
                  ranges, offering a spiritual and scenic experience.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="monastery-card">
              <img src={monastery3} alt="Tashiding Monastery" />
              <div className="overlay"></div>
              <div className="info">
                <h3>Tashiding Monastery</h3>
                <p>
                  Situated atop a hill, Tashiding is famed for its holy water
                  ceremony and peaceful surroundings that attract pilgrims year-round.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Plan Your Trip Section */}
      <section id="plan" className="plan-section">
        <div className="plan-grid">
          {planCards.map((card, index) => (
            <div
              className={`flip-card ${card.special ? "special-card" : ""} ${card.double ? "double-card" : ""}`}
              key={index}
            >
              <div className="flip-inner">
                {/* Front */}
                <div
                  className="flip-front"
                  style={
                    card.special
                      ? { backgroundColor: "#2c3e50" }
                      : { backgroundImage: `url(${card.img})` }
                  }
                >
                  <h3>{card.title}</h3>
                </div>
                {/* Back */}
                <div
                  className="flip-back"
                  style={
                    card.special
                      ? { backgroundColor: "#2c3e50" }
                      : { backgroundImage: `url(${card.img})` }
                  }
                >
                  <h3>{card.title}</h3>
                  {!card.special && (
                    <a
                      href="/explore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explore-btn"
                    >
                      Explore
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          {/* Left Info */}
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p>Email: info@monastery360.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Gangtok, Sikkim, India</p>
          </div>

          {/* Right Form */}
          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" rows="5" required></textarea>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Monastery360. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
