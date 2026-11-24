
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let isConfigured = false;

export const loadGooglePlaces = async () => {
  if (!apiKey) {
    throw new Error("Google Maps API key is missing");
  }

  if (!isConfigured) {
    setOptions({
      key: apiKey,
      v: "weekly",
    });

    isConfigured = true;
  }

  const placesLibrary = await importLibrary("places");

  return placesLibrary;
};
