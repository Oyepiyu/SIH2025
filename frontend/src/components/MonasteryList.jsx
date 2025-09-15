import React, { useState, useEffect } from 'react';
import { monasteryAPI, handleAPIError } from '../utils/api';

/**
 * Example component showing how to integrate backend API with frontend
 * This component can be used as a template for other pages
 */
const MonasteryList = () => {
  const [monasteries, setMonasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch monasteries on component mount
  useEffect(() => {
    const fetchMonasteries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call backend API
        const response = await monasteryAPI.getAll();
        setMonasteries(response.data || []);
      } catch (err) {
        const errorMessage = handleAPIError(err);
        setError(errorMessage);
        console.error('Failed to fetch monasteries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonasteries();
  }, []);

  // Handle search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await monasteryAPI.searchByText(query);
      setMonasteries(response.data || []);
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading monasteries...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Monasteries</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="monastery-list-container">
      <h2>Monasteries in Sikkim</h2>
      
      {/* Search functionality */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search monasteries..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e.target.value);
            }
          }}
        />
      </div>

      {/* Monastery cards */}
      <div className="monastery-grid">
        {monasteries.length > 0 ? (
          monasteries.map((monastery) => (
            <div key={monastery._id} className="monastery-card">
              <div className="monastery-image">
                {monastery.images && monastery.images[0] ? (
                  <img 
                    src={monastery.images[0].url} 
                    alt={monastery.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-monastery.jpg';
                    }}
                  />
                ) : (
                  <div className="placeholder-image">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              
              <div className="monastery-info">
                <h3>{monastery.name}</h3>
                <p className="description">{monastery.shortDescription}</p>
                
                {monastery.location && (
                  <p className="location">
                    📍 {monastery.location.district}, {monastery.location.state}
                  </p>
                )}
                
                {monastery.history && (
                  <p className="founded">
                    🏛️ Founded: {monastery.history.foundedYear}
                  </p>
                )}

                {monastery.rating && (
                  <div className="rating">
                    ⭐ {monastery.rating.average}/5 ({monastery.rating.count} reviews)
                  </div>
                )}

                <div className="monastery-actions">
                  <button className="btn-primary">
                    View Details
                  </button>
                  
                  {monastery.virtualTourAvailable && (
                    <button className="btn-secondary">
                      Virtual Tour
                    </button>
                  )}
                  
                  {monastery.audioGuideAvailable && (
                    <button className="btn-secondary">
                      Audio Guide
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No monasteries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonasteryList;