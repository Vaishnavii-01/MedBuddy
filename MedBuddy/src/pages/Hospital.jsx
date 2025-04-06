import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const Hospital = () => {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState([20.5937, 78.9629]); 
  const [hospitals, setHospitals] = useState([]);

  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const handleSearch = async () => {
    try {
      const geoRes = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
        params: {
          text: location,
          apiKey: GEOAPIFY_API_KEY,
        },
      });

      const { lat, lon } = geoRes.data.features[0].properties;
      setCoordinates([lat, lon]);

      const hospitalRes = await axios.get(`https://api.geoapify.com/v2/places`, {
        params: {
          categories: 'healthcare.hospital',
          filter: `circle:${lon},${lat},5000`,
          limit: 10,
          apiKey: GEOAPIFY_API_KEY,
        },
      });

      const hospitalList = hospitalRes.data.features.map((place) => ({
        name: place.properties.name || 'Unnamed Hospital',
        lat: place.geometry.coordinates[1],
        lon: place.geometry.coordinates[0],
        address: place.properties.address_line1,
      }));

      setHospitals(hospitalList);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      alert('Failed to fetch hospital data. Try again.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto p-4 space-y-4 md:space-y-0 md:space-x-4 bg-sky-200">
      <div className="flex-1 min-h-[400px] md:h-[90vh]">
        <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
          <MapContainer center={coordinates} zoom={13} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hospitals.map((hosp, idx) => (
              <Marker key={idx} position={[hosp.lat, hosp.lon]}>
                <Popup>
                  <strong>{hosp.name}</strong><br />
                  {hosp.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 p-6 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Search Nearby Hospitals</h2>
        <input
          type="text"
          placeholder="Enter city or location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-6"
        >
          Search
        </button>

        {hospitals.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Nearby Hospitals:</h3>
            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
              {hospitals.map((hosp, idx) => (
                <li key={idx} className="p-2 border border-gray-300 rounded bg-white shadow-sm">
                  <strong>{hosp.name}</strong><br />
                  <span className="text-sm text-gray-600">{hosp.address}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospital;