import { useState, useEffect, useRef } from "react";











const CHICAGO_DEFAULT = {
  lat: 41.8827,
  lng: -87.6233,
  accuracy: 10,
  heading: 45,
  speed: 8.5
};

// Simulated movement: drift along a gentle arc to look like a bus route
function simulateDrift(base, tick) {
  const t = tick * 0.008;
  return {
    ...base,
    lat: base.lat + Math.sin(t) * 0.0004,
    lng: base.lng + Math.cos(t * 0.7) * 0.0003,
    heading: t * 30 % 360,
    speed: 6 + Math.sin(t * 2) * 3
  };
}

export function useGeoLocation() {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState("idle");
  const watchIdRef = useRef(null);
  const simulationRef = useRef(null);
  const tickRef = useRef(0);
  const baseRef = useRef(CHICAGO_DEFAULT);

  const startSimulation = (base) => {
    baseRef.current = base;
    tickRef.current = 0;
    setStatus("simulated");
    setPosition(base);
    simulationRef.current = setInterval(() => {
      tickRef.current += 1;
      setPosition(simulateDrift(baseRef.current, tickRef.current));
    }, 2000);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      startSimulation(CHICAGO_DEFAULT);
      return;
    }

    setStatus("acquiring");

    // Single shot to get initial position quickly
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed
        };
        setPosition(p);
        setStatus("active");
        baseRef.current = p;
      },
      () => {
        // Fall back to simulation if denied or unavailable
        startSimulation(CHICAGO_DEFAULT);
      },
      { timeout: 6000, maximumAge: 10000 }
    );

    // Continuous watch
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const p = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed
        };
        // Clear simulation if real GPS kicks in
        if (simulationRef.current) {
          clearInterval(simulationRef.current);
          simulationRef.current = null;
        }
        setPosition(p);
        setStatus("active");
        baseRef.current = p;
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          startSimulation(CHICAGO_DEFAULT);
        } else {
          setStatus("error");
          startSimulation(baseRef.current);
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, []);

  return { position, status };
}
