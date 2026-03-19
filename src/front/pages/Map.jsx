import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = () => {

  const mapContainer = useRef(null);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(async (position) => {

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [userLng, userLat],
        zoom: 13
      });

      // marcador de usuario
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat([userLng, userLat])
        .setPopup(new mapboxgl.Popup().setHTML("<b>Tu ubicación</b>"))
        .addTo(map);

      // obtener comercios
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/nearby-professionals`
      );

      const places = await response.json();

      places.forEach(place => {

        const distance = getDistance(
          userLat,
          userLng,
          place.lat,
          place.lng
        );

        new mapboxgl.Marker()
          .setLngLat([place.lng, place.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<b>${place.name}</b>
               <br>⭐ ${place.rating}
               <br>📏 ${distance} km`
            )
          )
          .addTo(map);

      });

    });

  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ height: "80vh", width: "100%" }}
    />
  );
};

// función distancia
function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2);
}