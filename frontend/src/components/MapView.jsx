import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox token from .env
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapView = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // Initialize the map only once
    if (mapRef.current) return; // prevents re-initialization

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [144.9631, -37.8136], // Melbourne
      zoom: 11
    });

    // Add navigation controls (zoom buttons)
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  useEffect(() => {
    // Fetch projects from backend
    axios.get("http://localhost:5000/api/projects")
      .then(res => {
        setProjects(res.data);

        // Add markers to the map
        res.data.forEach(project => {
          const marker = new mapboxgl.Marker()
            .setLngLat([project.longitude, project.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <strong>${project.projectName}</strong><br/>
                ${project.address}<br/>
                Status: ${project.status}<br/>
                Year: ${project.year}
              `)
            )
            .addTo(mapRef.current);

          // Optional: open popup on click
          marker.getElement().addEventListener("click", () => {
            setSelectedProject(project);
          });
        });
      })
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default MapView;
