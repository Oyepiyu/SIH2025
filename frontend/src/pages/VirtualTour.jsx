import React, { useState, useEffect } from "react";
import monastery1 from "../assets/monastery1.jpg";
import monastery2 from "../assets/monastery2.jpg";
import monastery3 from "../assets/monastery3.jpg";
import bgImage from "../assets/virtualtour.jpeg"; // ✅ import your background image
import "../App.css"; // reuse styling
import { useNavigate } from "react-router-dom";
import { virtualTourAPI } from "../utils/api";

const VirtualTour = () => {
  const navigate = useNavigate();
  const [virtualTours, setVirtualTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch virtual tours from API
  useEffect(() => {
    const fetchVirtualTours = async () => {
      try {
        setLoading(true);
        const response = await virtualTourAPI.getAll();
        if (response.success && response.data && response.data.tours) {
          setVirtualTours(response.data.tours);
        }
      } catch (err) {
        console.error('Error fetching virtual tours:', err);
        setError('Failed to load virtual tours');
        // Fallback to static data if API fails
        setVirtualTours([
          {
            _id: '1',
            title: 'Rumtek Monastery Tour',
            description: 'Experience the magnificent Rumtek Monastery in immersive 360-degree virtual reality.',
            monastery: { name: 'Rumtek Monastery' }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVirtualTours();
  }, []);
  return (
    <div
      className="virtual-tour-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        padding: "2rem",
        color: "black",
      }}
    >
      <h2 className="virtual-tour-title">Virtual Tour</h2>

      {loading && <div className="loading">Loading virtual tours...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="virtual-tour-cards">
        {virtualTours.map((tour) => (
          <div key={tour._id} className="virtual-tour-card">
            <img 
              src={monastery1} 
              alt={tour.monastery?.name || tour.title} 
            />
            <div className="card-info">
              <h3>{tour.monastery?.name || tour.title}</h3>
              <p>{tour.description}</p>
              <button
                className="tour-btn"
                onClick={() => navigate(`/rumtek-tour`)}
              >
                Start Virtual Tour
              </button>
            </div>
          </div>
        ))}
        
        {/* Fallback card if no tours available */}
        {!loading && virtualTours.length === 0 && !error && (
          <div className="virtual-tour-card">
            <img src={monastery1} alt="Rumtek Monastery" />
            <div className="card-info">
              <h3>Rumtek Monastery</h3>
              <p>
                Known as the Dharma Chakra Centre, Rumtek is one of the largest
                monasteries in Sikkim with stunning golden stupa and Tibetan
                architecture.
              </p>
              <button
                className="tour-btn"
                onClick={() => navigate("/rumtek-tour")}
              >
                Start Virtual Tour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTour;
