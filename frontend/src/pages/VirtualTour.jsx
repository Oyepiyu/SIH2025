import React from "react";
import monastery1 from "../assets/monastery1.jpg";
import monastery2 from "../assets/monastery2.jpg";
import monastery3 from "../assets/monastery3.jpg";
import bgImage from "../assets/virtualtour.jpeg"; // ✅ import your background image
import "../App.css"; // reuse styling

const VirtualTour = () => {
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

      <div className="virtual-tour-cards">
        {/* Card 1 */}
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
              onClick={() => window.open("/rumtek-tour", "_blank")}
            >
              Start Virtual Tour
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="virtual-tour-card">
          <img src={monastery2} alt="Pemayangtse Monastery" />
          <div className="card-info">
            <h3>Pemayangtse Monastery</h3>
            <p>
              This 300-year-old monastery overlooks the majestic Kanchenjunga
              ranges, offering a spiritual and scenic experience.
            </p>
            <button className="tour-btn disabled">Start Virtual Tour</button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="virtual-tour-card">
          <img src={monastery3} alt="Tashiding Monastery" />
          <div className="card-info">
            <h3>Tashiding Monastery</h3>
            <p>
              Situated atop a hill, Tashiding is famed for its holy water
              ceremony and peaceful surroundings that attract pilgrims year-round.
            </p>
            <button className="tour-btn disabled">Start Virtual Tour</button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default VirtualTour;
