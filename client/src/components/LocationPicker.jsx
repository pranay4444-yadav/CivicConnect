import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(event) {
      const coords = {
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      };

      setPosition(coords);

      if (onLocationSelect) {
        onLocationSelect(coords);
      }
    },
  });

  if (!position) {
    return null;
  }

  return (
    <CircleMarker
      center={[position.latitude, position.longitude]}
      radius={10}
    />
  );
}

function MapController({ position }) {
  const map = useMap();

  if (position) {
    map.setView(
      [position.latitude, position.longitude],
      15
    );
  }

  return null;
}

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const bengaluruCenter = [12.9716, 77.5946];

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location services.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setPosition(coords);

        if (onLocationSelect) {
          onLocationSelect(coords);
        }

        setLoadingLocation(false);
      },
      () => {
        alert(
          "Unable to get your location. Please allow location access or select the location manually."
        );

        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="location-picker">

      <button
        type="button"
        className="current-location-button"
        onClick={handleCurrentLocation}
        disabled={loadingLocation}
      >
        📍{" "}
        {loadingLocation
          ? "Getting your location..."
          : "Use my current location"}
      </button>

      <MapContainer
        center={bengaluruCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="location-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />

        <MapController position={position} />
      </MapContainer>

      <div className="map-help">
        📍 Click on the map to select the exact issue location.
      </div>

      {position && (
        <div className="selected-coordinates">
          <strong>Selected location:</strong>{" "}
          {position.latitude.toFixed(6)},{" "}
          {position.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
}

export default LocationPicker;
