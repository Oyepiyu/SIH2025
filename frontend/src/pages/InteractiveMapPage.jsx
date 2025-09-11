import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

// ✅ 20 Monasteries in Sikkim
const monasteries = [
  { name: "Rumtek Monastery", lat: 27.3256, lng: 88.6115, description: "Known as the Dharma Chakra Centre, one of the largest monasteries in Sikkim." },
  { name: "Pemayangtse Monastery", lat: 27.3171, lng: 88.2394, description: "A 300-year-old monastery overlooking Kanchenjunga ranges." },
  { name: "Tashiding Monastery", lat: 27.2885, lng: 88.2813, description: "Famed for its holy water ceremony and peaceful surroundings." },
  { name: "Enchey Monastery", lat: 27.3386, lng: 88.6121, description: "Famous for Cham dances near Gangtok." },
  { name: "Phodong Monastery", lat: 27.349, lng: 88.604, description: "18th-century monastery with vibrant murals." },
  { name: "Ralang Monastery", lat: 27.2919, lng: 88.3835, description: "Built to commemorate the Dalai Lama’s visit, known for Kagyu dance festival." },
  { name: "Lingdum Monastery", lat: 27.3457, lng: 88.6783, description: "Also called Ranka Monastery, with beautiful murals and peaceful vibes." },
  { name: "Lachen Monastery", lat: 27.7169, lng: 88.5573, description: "Small monastery amidst scenic landscapes in North Sikkim." },
  { name: "Lachung Monastery", lat: 27.6906, lng: 88.7435, description: "Over 200 years old, set in the picturesque Lachung valley." },
  { name: "Zurmang Kagyud Monastery", lat: 27.3089, lng: 88.6135, description: "Renowned for Tibetan Buddhist architecture and teachings." },
  { name: "Sanga Choeling Monastery", lat: 27.3152, lng: 88.2417, description: "One of the oldest monasteries, accessible via a forest trail." },
  { name: "Dubdi Monastery", lat: 27.2983, lng: 88.2341, description: "Known as Yuksom Monastery, considered the oldest in Sikkim (1701)." },
  { name: "Kartok Monastery", lat: 27.2978, lng: 88.2444, description: "Situated near a lake in Yuksom, very peaceful surroundings." },
  { name: "Tholung Monastery", lat: 27.6422, lng: 88.4883, description: "Houses precious relics and manuscripts, located in Dzongu." },
  { name: "Yangyang Monastery", lat: 27.2778, lng: 88.4147, description: "A growing Buddhist learning center with spiritual significance." },
  { name: "Bokar Monastery", lat: 27.3074, lng: 88.2431, description: "Famous for rituals and serene environment near Mirik border." },
  { name: "Mangbrue Monastery", lat: 27.287, lng: 88.26, description: "A lesser-known monastery in West Sikkim with traditional style." },
  { name: "Simik Monastery", lat: 27.2939, lng: 88.5795, description: "A quiet monastery located near Singtam." },
  { name: "Hee Gyathang Monastery", lat: 27.569, lng: 88.524, description: "Located in Dzongu, surrounded by Lepcha community villages." },
  { name: "Samdruptse Monastery", lat: 27.2264, lng: 88.6162, description: "Near Namchi, famous for giant Guru Padmasambhava statue." },
];

const InteractiveMapPage = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h2 style={{ textAlign: "center", margin: "20px" }}>
        Interactive Map of Sikkim Monasteries
      </h2>

      <MapContainer
        center={[27.33, 88.62]} // Rough center of Sikkim
        zoom={8}
        style={{
          height: "80vh",
          width: "90%",
          margin: "auto",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {monasteries.map((m, idx) => (
          <Marker key={idx} position={[m.lat, m.lng]}>
            <Popup>
              <div style={{ width: "200px", textAlign: "center" }}>
                <b>{m.name}</b>
                <p style={{ marginTop: "6px", fontSize: "0.85rem" }}>
                  {m.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMapPage;
