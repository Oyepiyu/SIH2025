import React, { useState, useEffect } from "react";
import { FaUpload, FaMapMarkerAlt, FaSpinner, FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import "../App.css";
import bgImage from "../assets/Audio.jpeg"; // ✅ Import your background image
import { audioGuideAPI } from "../utils/api";

const AudioGuide = () => {
  const [location, setLocation] = useState("");
  const [audioGuides, setAudioGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Smart Audio Guide states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Fetch audio guides from API
  useEffect(() => {
    const fetchAudioGuides = async () => {
      try {
        setLoading(true);
        const response = await audioGuideAPI.getAll();
        if (response.success && response.data && response.data.guides) {
          setAudioGuides(response.data.guides);
        }
      } catch (err) {
        console.error('Error fetching audio guides:', err);
        setError('Failed to load audio guides');
      } finally {
        setLoading(false);
      }
    };

    fetchAudioGuides();
  }, []);

  // Image Upload Handler with enhanced validation and preview
  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setSelectedImage(file);
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await audioGuideAPI.identifyLocation(formData);
      if (response.success && response.data) {
        setAudioResult(response.data);
      } else {
        throw new Error('Could not identify location from image');
      }
    } catch (error) {
      console.error('Image recognition failed:', error);
      setError('Could not identify location. Please try another image.');
      setImagePreview(null);
      setSelectedImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // File input change handler
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleImageUpload(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  // Location-Based Audio Handler
  const handleLocationAudio = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Get user's current location
      const position = await getCurrentLocation();
      setUserLocation(position);

      // Find nearby audio guides
      const response = await audioGuideAPI.getByLocation(
        position.coords.latitude, 
        position.coords.longitude,
        5000, // 5km radius
        'en' // language
      );
      
      if (response.success && response.data) {
        setAudioResult(response.data);
      } else {
        throw new Error('No audio guides found nearby');
      }
    } catch (error) {
      console.error('Location audio failed:', error);
      if (error.message.includes('User denied')) {
        setError('Please allow location access to use this feature.');
      } else if (error.message.includes('No audio guides')) {
        setError('No audio guides found in your area. Try a different location.');
      } else {
        setError('Could not get location. Please check your browser settings.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Get user location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('User denied the request for Geolocation'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information is unavailable'));
              break;
            case error.TIMEOUT:
              reject(new Error('The request to get user location timed out'));
              break;
            default:
              reject(new Error('An unknown error occurred'));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    });
  };

  // Audio playback handlers
  const handlePlayAudio = () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    } else if (audioResult && audioResult.audioUrl) {
      const audio = new Audio(audioResult.audioUrl);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('error', () => {
        setError('Failed to load audio file');
        setIsPlaying(false);
      });
      setCurrentAudio(audio);
      audio.play();
      setIsPlaying(true);
    }
  };

  // Clear results
  const clearResults = () => {
    setAudioResult(null);
    setSelectedImage(null);
    setImagePreview(null);
    setUserLocation(null);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setError(null);
  };

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

      {/* Error Display */}
      {error && (
        <div className="error-message" style={{ 
          backgroundColor: 'rgba(220, 38, 127, 0.1)', 
          border: '1px solid #dc2626', 
          color: '#dc2626',
          padding: '1rem',
          margin: '1rem auto',
          maxWidth: '600px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {error}
          <button 
            onClick={() => setError(null)} 
            style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="processing-message" style={{
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid #3b82f6',
          color: '#3b82f6',
          padding: '1rem',
          margin: '1rem auto',
          maxWidth: '600px',
          borderRadius: '8px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <FaSpinner className="spinning" />
          <span>Processing... Finding audio guide for you</span>
        </div>
      )}

      {/* Audio Result Display */}
      {audioResult && !isProcessing && (
        <div className="audio-result" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          margin: '2rem auto',
          maxWidth: '700px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ color: '#333', margin: '0 0 0.5rem 0', flex: 1 }}>{audioResult.title}</h3>
            <button 
              onClick={clearResults}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '1.5rem', 
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>
          
          {audioResult.monastery && (
            <div style={{ marginBottom: '1rem', color: '#666' }}>
              <strong>📍 {audioResult.monastery.name}</strong>
              {audioResult.distance && <span> • {audioResult.distance}m away</span>}
              {audioResult.recognizedLocation && <span> • Recognized: {audioResult.recognizedLocation}</span>}
              {audioResult.confidence && <span> • {Math.round(audioResult.confidence * 100)}% confidence</span>}
            </div>
          )}

          <p style={{ color: '#555', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {audioResult.description}
          </p>

          {audioResult.audioUrl && (
            <div className="audio-controls" style={{ marginBottom: '1rem' }}>
              <button
                onClick={handlePlayAudio}
                style={{
                  backgroundColor: isPlaying ? '#ef4444' : '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
                {isPlaying ? 'Pause Audio' : 'Play Audio Guide'}
                <FaVolumeUp />
              </button>
              
              {audioResult.duration && (
                <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                  Duration: {Math.floor(audioResult.duration / 60)}:{(audioResult.duration % 60).toString().padStart(2, '0')} min
                </p>
              )}
            </div>
          )}

          <audio
            ref={(audio) => {
              if (audio && audioResult.audioUrl && !currentAudio) {
                audio.addEventListener('ended', () => setIsPlaying(false));
                audio.addEventListener('error', () => {
                  setError('Failed to load audio file');
                  setIsPlaying(false);
                });
              }
            }}
            style={{ width: '100%', marginTop: '1rem' }}
            controls
            preload="metadata"
          >
            <source src={audioResult.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

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
              {/* Enhanced Image Upload Section */}
              <div 
                className={`image-upload-zone ${dragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? '#10b981' : '#ccc'}`,
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: dragOver ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.95)',
                  transition: 'all 0.3s ease',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  opacity: isProcessing ? 0.7 : 1,
                  position: 'relative',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  id="image-upload"
                  style={{ display: 'none' }}
                  disabled={isProcessing}
                />
                
                {/* Image Preview */}
                {imagePreview && !isProcessing && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={imagePreview} 
                      alt="Upload preview" 
                      style={{ 
                        maxWidth: '150px', 
                        maxHeight: '150px', 
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '2px solid #e5e7eb'
                      }} 
                    />
                    <button 
                      onClick={clearResults}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Upload UI */}
                {!imagePreview && !isProcessing && (
                  <>
                    <FaUpload size={48} color="#6b7280" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
                      {dragOver ? 'Drop your image here' : 'Upload Monastery Image'}
                    </h4>
                    <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                      Drag & drop or click to browse
                    </p>
                    <label htmlFor="image-upload">
                      <button 
                        type="button"
                        style={{ 
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                      >
                        Choose Image
                      </button>
                    </label>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>
                      Supports: JPG, PNG, GIF • Max size: 10MB
                    </p>
                  </>
                )}

                {/* Processing State */}
                {isProcessing && (
                  <div style={{ textAlign: 'center' }}>
                    <FaSpinner className="spinning" size={32} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
                      Analyzing Image...
                    </h4>
                    <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>
                      Identifying monastery and finding audio guide
                    </p>
                  </div>
                )}
              </div>
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
            </div>
            <div className="card-hover">
              <button 
                onClick={handleLocationAudio}
                disabled={isProcessing}
                style={{ 
                  opacity: isProcessing ? 0.6 : 1
                }}
              >
                {isProcessing ? 'Getting Location...' : 'Start Location Audio'}
              </button>
            </div>
          </div>
          <h3 className="card-title">Location Based Audio</h3>
        </div>
      </div>

      {/* Existing Audio Guides List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
          <FaSpinner className="spinning" size={30} />
          <p>Loading audio guides...</p>
        </div>
      ) : audioGuides.length > 0 && (
        <div className="existing-guides" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          margin: '2rem auto',
          maxWidth: '800px',
          padding: '2rem',
          borderRadius: '15px'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
            Available Audio Guides ({audioGuides.length})
          </h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {audioGuides.map((guide) => (
              <div key={guide._id} style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{guide.title}</h4>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                  {guide.monastery?.name}
                </p>
                {guide.duration && (
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {Math.floor(guide.duration / 60)}:{(guide.duration % 60).toString().padStart(2, '0')} min
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioGuide;
