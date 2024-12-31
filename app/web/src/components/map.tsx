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
import { COMING_SOON_MODE } from "@/utils/feature-flags";

type Gathering = { key: string; location: google.maps.LatLngLiteral };
const locations: Gathering[] = [];

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

  console.log("COMING_SOON_MODE: ", COMING_SOON_MODE);

  useEffect(() => {
    if (!COMING_SOON_MODE) {
      monitorLocationPermissions({
        onGranted: () => {
          setArePermissionsGranted(true);
        },
        onDenied: () => {
          setArePermissionsGranted(false);
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!COMING_SOON_MODE) {
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
    }
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
        console.log("clicked at: ", ev.detail.latLng);
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
