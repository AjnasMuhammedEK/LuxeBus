
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, Loader2, Search, X } from "lucide-react";
import toast from "react-hot-toast";

import type { IRouteLocation } from "@/types/route.types";

interface RouteLocationPickerProps {
  label: string;
  value: IRouteLocation | null;
  onChange: (location: IRouteLocation | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface PhotonFeature {
  properties: {
    osm_type?: string;
    osm_id?: number | string;
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    district?: string;
    county?: string;
    state?: string;
    country?: string;
    locality?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

const PHOTON_API_URL = "https://photon.komoot.io/api/";

const RouteLocationPicker = ({
  label,
  value,
  onChange,
  placeholder = "Search for a location...",
  disabled = false,
}: RouteLocationPickerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);

  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(Boolean(value));
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Keep the input synchronized if the parent resets or changes its value.
  useEffect(() => {
    setQuery(value?.name ?? "");
    setSelected(Boolean(value));
  }, [value?.placeId]);

  // Search Photon after the user pauses typing.
  useEffect(() => {
    const searchQuery = query.trim();

    if (disabled || selected || searchQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          q: searchQuery,
          limit: "7",
          lang: "en",
          countrycode: "IN"
        });

        const response = await fetch(
          `${PHOTON_API_URL}?${params.toString()}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 429
              ? "Location search is temporarily busy. Please try again shortly."
              : "Unable to search locations. Please try again.",
          );
        }

        const data: PhotonResponse = await response.json();

        if (controller.signal.aborted) return;

        setResults(data.features ?? []);
        setIsOpen(true);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Photon location search failed:", error);

        setResults([]);
        setIsOpen(false);

        toast.error(
          error instanceof Error
            ? error.message
            : "Location search failed",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, selected, disabled]);

  // Render the suggestions outside the modal's scroll container.
  useEffect(() => {
    if (!isOpen || results.length === 0) {
      setDropdownPosition(null);
      return;
    }

    const updatePosition = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();

      if (!rect) return;

      setDropdownPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, results]);

  const getLocationDetails = (
    feature: PhotonFeature,
  ): IRouteLocation | null => {
    const properties = feature.properties;
    const [longitude, latitude] = feature.geometry.coordinates;

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180 ||
      !properties.osm_type ||
      !properties.osm_id
    ) {
      return null;
    }

    const name =
      properties.name ||
      properties.locality ||
      properties.street ||
      properties.city ||
      properties.district;

    if (!name) return null;

    const street = [
      properties.housenumber,
      properties.street,
    ]
      .filter(Boolean)
      .join(" ");

    const addressParts = [
      street,
      properties.locality,
      properties.city,
      properties.district,
      properties.county,
      properties.state,
      properties.postcode,
      properties.country,
    ].filter(
      (part, index, array) =>
        Boolean(part) && array.indexOf(part) === index,
    );

    return {
      name,
      address: addressParts.join(", ") || name,
      placeId: `osm:${properties.osm_type}:${properties.osm_id}`,
      latitude,
      longitude,
    };
  };

  const handleSelect = (feature: PhotonFeature) => {
    const location = getLocationDetails(feature);

    if (!location) {
      toast.error("This location does not have valid coordinates");
      return;
    }

    setQuery(location.name);
    setSelected(true);
    setResults([]);
    setIsOpen(false);
    setDropdownPosition(null);

    onChangeRef.current(location);
  };

  const handleInputChange = (newValue: string) => {
    setQuery(newValue);
    setSelected(false);
    setIsOpen(true);

    // A previous selection is no longer valid after editing the text.
    if (value) {
      onChangeRef.current(null);
    }
  };

  const clearLocation = () => {
    setQuery("");
    setSelected(false);
    setResults([]);
    setIsOpen(false);
    onChangeRef.current(null);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div
        ref={wrapperRef}
        className={`relative w-full rounded-lg border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <div className="flex min-h-[44px] items-center gap-2 px-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(event) =>
              handleInputChange(event.target.value)
            }
            onFocus={() => {
              if (!selected && query.trim().length >= 3) {
                setIsOpen(true);
              }
            }}
            className="h-[42px] min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          )}

          {query && !loading && (
            <button
              type="button"
              onClick={clearLocation}
              disabled={disabled}
              aria-label="Clear location"
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {isOpen &&
        dropdownPosition &&
        results.length > 0 &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 9999,
            }}
            className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
          >
            {results.map((feature, index) => {
              const location = getLocationDetails(feature);

              if (!location) return null;

              return (
                <button
                  key={location.placeId}
                  type="button"
                  onClick={() => handleSelect(feature)}
                  className="flex w-full items-start gap-3 px-3 py-3 text-left transition hover:bg-blue-50"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-slate-800">
                      {location.name}
                    </span>

                    <span className="mt-0.5 block text-xs text-slate-500">
                      {location.address}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}

      {!loading &&
        !selected &&
        query.trim().length >= 3 &&
        results.length === 0 &&
        !isOpen && (
          <p className="text-xs text-slate-500">
            No matching locations found. Try another search.
          </p>
        )}

      {value && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">
              {value.name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {value.address}
            </p>

            <button
              type="button"
              disabled={disabled}
              onClick={clearLocation}
              className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Clear location
            </button>
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-400">
        Location data © OpenStreetMap contributors
      </p>
    </div>
  );
};

export default RouteLocationPicker;
