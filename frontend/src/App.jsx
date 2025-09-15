import React, { useState } from "react";
import "./App.css";
import { useNavigate, Link } from "react-router-dom";
import { contactAPI, monasteryAPI } from "./utils/api";


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
  const navigate = useNavigate();
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    subject: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Handle form input changes
  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Client-side validation
    if (contactForm.message.trim().length < 10) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Message must be at least 10 characters long.' 
      });
      setIsSubmitting(false);
      return;
    }

    if (contactForm.name.trim().length < 2) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Name must be at least 2 characters long.' 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await contactAPI.submit({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        message: contactForm.message.trim(),
        subject: contactForm.subject.trim() || 'General Inquiry',
        category: 'general'
      });
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Thank you! Your message has been sent successfully.' 
      });
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        message: '',
        subject: ''
      });
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to send message. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const planCards = [
    { title: "Plan Your Visit", img: "", special: true },
    { title: "Packages", img: packagesImg },
    { title: "Hotels", img: hotelsImg, double: true },
    { title: "Tourist Spots", img: touristSpotsImg, double: true },
    { title: "Monasteries", img: monasteriesImg },
    { title: "Cultural Heritage", img: heritageImg },
  ];

  // Monastery data state
  const [monasteries, setMonasteries] = useState([]);
  const [monasteryLoading, setMonasteryLoading] = useState(true);

  // Fetch monastery data
  React.useEffect(() => {
    const fetchMonasteries = async () => {
      try {
        const response = await monasteryAPI.getAll();
        if (response.success && response.data && response.data.monasteries) {
          setMonasteries(response.data.monasteries.slice(0, 3)); // Get first 3 monasteries for homepage
        }
      } catch (error) {
        console.error('Error fetching monasteries:', error);
        // Use fallback static data
        setMonasteries([
          {
            name: "Rumtek Monastery",
            shortDescription: "Known as the Dharma Chakra Centre, Rumtek is one of the largest monasteries in Sikkim with stunning golden stupa and Tibetan architecture."
          },
          {
            name: "Pemayangtse Monastery", 
            shortDescription: "This 300-year-old monastery overlooks the majestic Kanchenjunga ranges, offering a spiritual and scenic experience."
          },
          {
            name: "Tashiding Monastery",
            shortDescription: "Situated atop a hill, Tashiding is famed for its holy water ceremony and peaceful surroundings that attract pilgrims year-round."
          }
        ]);
      } finally {
        setMonasteryLoading(false);
      }
    };

    fetchMonasteries();
  }, []);

  // Removed manual anchor scroll logic; handled by ScrollToTop and React Router

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
            <li><Link to="/">Home</Link></li>
            <li><a href="#experience" onClick={(e) => { 
              e.preventDefault(); 
              document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }}>Experience</a></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/virtual-tour">Virtual Tour</Link></li>
            <li><a href="#events" onClick={(e) => { 
              e.preventDefault(); 
              // Events section doesn't exist, scroll to plan instead
              document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }}>Events</a></li>
            <li><a href="#plan" onClick={(e) => { 
              e.preventDefault(); 
              document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }}>Plan your trip</a></li>
            <li><a href="#contact" onClick={(e) => { 
              e.preventDefault(); 
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }}>Contact Us</a></li>
          </ul>
        </div>

        <div className="navbar-right">
          <button className="icon-btn" aria-label="Search" onClick={() => navigate("/explore")}>🔍</button>
          <button className="icon-btn" aria-label="Saved">♡</button>
          <button className="icon-btn" aria-label="Map" onClick={() => navigate("/interactive-map")}>🗺️</button>
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
            {monasteries.map((monastery, index) => (
              <div key={monastery._id || index} className="monastery-card">
                <img src={index === 0 ? monastery1 : index === 1 ? monastery2 : monastery3} alt={monastery.name} />
                <div className="overlay"></div>
                <div className="info">
                  <h3>{monastery.name}</h3>
                  <p>{monastery.shortDescription || monastery.description}</p>
                </div>
              </div>
            ))}
            
            {/* Fallback if no data */}
            {!monasteryLoading && monasteries.length === 0 && (
              <div className="monastery-card">
                <img src={monastery1} alt="Monastery" />
                <div className="overlay"></div>
                <div className="info">
                  <h3>Monasteries of Sikkim</h3>
                  <p>Explore the spiritual heritage of Sikkim's ancient monasteries.</p>
                </div>
              </div>
            )}

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
            {submitStatus.message && (
              <div className={`status-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}
            <form onSubmit={handleContactSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={contactForm.name}
                onChange={handleContactChange}
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={contactForm.email}
                onChange={handleContactChange}
                required 
              />
              <input 
                type="text" 
                name="subject"
                placeholder="Subject (Optional)" 
                value={contactForm.subject}
                onChange={handleContactChange}
              />
              <div className="textarea-container">
                <textarea 
                  name="message"
                  placeholder="Your Message (minimum 10 characters)" 
                  rows="5" 
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                ></textarea>
                <div className="char-count">
                  {contactForm.message.length}/10 characters minimum
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
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
