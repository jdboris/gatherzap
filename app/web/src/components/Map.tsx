"use client";
import { useEffect, useState, useRef, useCallback } from "react";

import {
  Map as GoogleMap,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";

import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

type Gathering = { key: string; location: google.maps.LatLngLiteral };
const locations: Gathering[] = [];
// const locations: Gathering[] = [
//   { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
//   { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
//   { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
//   { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
//   { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
//   { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
//   { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
//   { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
//   { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
//   { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
//   { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
//   { key: "kingStreetWharf", location: { lat: -33.8665445, lng: 151.1989808 } },
//   { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
//   { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
//   { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
// ];

function getDeviceLocation() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation API is not supported in this browser.");
  }

  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
        {}
      );
    }
  );
}

function monitorLocationPermissions({
  onGranted,
  onDenied,
}: {
  onGranted: () => void;
  onDenied: () => void;
}) {
  if (!navigator.permissions) {
    throw new Error("Permissions API is not supported in this browser.");
  }

  return navigator.permissions
    .query({ name: "geolocation" })
    .then((permissionStatus) => {
      if (permissionStatus.state === "granted") {
        onGranted();
      } else if (permissionStatus.state === "denied") {
        onDenied();
      }
      // else if (permissionStatus.state === "prompt") {
      //   console.log("User has not yet made a decision.");
      // }

      // Listen for changes to the permission state
      permissionStatus.onchange = () => {
        if (permissionStatus.state === "granted") {
          onGranted();
        } else if (permissionStatus.state === "denied") {
          onDenied();
        }
      };
    });
}

const Map = () => {
  const map = useMap();

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  const [arePermissionsGranted, setArePermissionsGranted] = useState<boolean>();

  useEffect(() => {
    monitorLocationPermissions({
      onGranted: () => {
        setArePermissionsGranted(true);
      },
      onDenied: () => {
        setArePermissionsGranted(false);
      },
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!map) return;

        if (!userLocation) {
          const location = await getDeviceLocation();
          setUserLocation(location);
          map.panTo({ lat: location.latitude, lng: location.longitude });
          map.setZoom(15);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [map, userLocation, arePermissionsGranted]);

  return (
    <GoogleMap
      defaultZoom={userLocation ? 15 : 3}
      defaultCenter={{
        lat: userLocation?.latitude || 0,
        lng: userLocation?.longitude || 0,
      }}
      onCameraChanged={(ev: MapCameraChangedEvent) =>
        console.log(
          "camera changed:",
          ev.detail.center,
          "zoom:",
          ev.detail.zoom
        )
      }
      onClick={(ev: MapMouseEvent) => {
        console.log(ev.detail.latLng);
      }}
    >
      <GatheringMarkers gatherings={locations} />
    </GoogleMap>
  );
};

const GatheringMarkers = (props: { gatherings: Gathering[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log("marker clicked: ", ev.latLng.toString());
      map.panTo(ev.latLng);
    },
    [map]
  );
  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {props.gatherings.map((gathering: Gathering) => (
        <AdvancedMarker
          key={gathering.key}
          position={gathering.location}
          ref={(marker) => setMarkerRef(marker, gathering.key)}
          clickable={true}
          onClick={handleClick}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default Map;
