import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Hospital = () => {
  return (
    <div className="flex flex-col md:flex-row h-[90vh] p-4 space-y-4 md:space-y-0 md:space-x-4 bg-sky-200">
      {/* Map Section */}
      <div className="flex-1">
        <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
          <MapContainer
            center={[20.5937, 78.9629]} // Centered on India
            zoom={5}
            className="h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Additional map components like markers can be added here */}
          </MapContainer>
        </div>
      </div>

      {/* Search Engine Section */}
      <div className="flex-1 bg-slate-100 p-6 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Search Engine</h2>
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Additional search-related components can be added here */}
      </div>
    </div>
  );
};


export default Hospital;
