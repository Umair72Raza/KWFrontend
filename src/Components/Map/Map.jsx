import React, { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Container, Input, Spinner } from "reactstrap";
import { useDebounce } from "../../Hooks/Debounce";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { set } from "lodash";

const libraries = [import.meta.env.VITE_GOOGLE_API_LIBARARY];

const GoogleMapContainer = React.memo(
  ({ currentLocation, selectedLocation, onMapClick }) => {
    return (
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "200px",
          margin: "40px 0",
        }}
        center={currentLocation || { lat: 0, lng: 0 }}
        zoom={currentLocation ? 12 : 3}
        options={{
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
        onClick={onMapClick}
      >
        {currentLocation && <Marker position={currentLocation} />}
        {selectedLocation && window.google && (
          <Marker
            position={selectedLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
      </GoogleMap>
    );
  }
);

GoogleMapContainer.propTypes = {
  currentLocation: PropTypes.object,
  selectedLocation: PropTypes.object,
  onMapClick: PropTypes.func.isRequired,
};

const Map = React.memo(
  ({ setFormData, formData, editMode, errors, setErrors }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [newInput, setNewInput] = useState(formData?.address);
    const [country, setCountry] = useState(formData?.country);
    const autocompleteRef = useRef(null);
    const debouncedAddress = useDebounce(newInput);
    const location = useLocation();
    const [loadScriptKey, setLoadScriptKey] = useState(0);
    const [isMapLoaded, setMapLoaded] = useState(false);
    const [isInputEnabled, setInputEnabled] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { UsersData } = useSelector((state) => state.editProfile);

    const handleMapClick = useCallback(
      (event) => {
        const { latLng } = event;
        const latitude = latLng.lat();
        const longitude = latLng.lng();

        setSelectedLocation({ lat: latitude, lng: longitude });

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              if (!formData) {
                setNewInput(results[0].formatted_address);
                setFormData((prev) => ({
                  ...prev,
                  address: results[0].formatted_address,
                  latitude: results[0].geometry.location.lat(),
                  longitude: results[0].geometry.location.lng(),
                  country:
                    results[0].address_components.find((component) =>
                      component.types.includes("country")
                    )?.short_name || "",
                }));
              } else {
                setNewInput(results[0].formatted_address);
                setFormData((prev) => ({
                  ...prev,
                  address: results[0].formatted_address,
                  latitude: results[0].geometry.location.lat(),
                  longitude: results[0].geometry.location.lng(),
                  country:
                    results[0].address_components.find((component) =>
                      component.types.includes("country")
                    )?.short_name || "",
                }));
              }
            } else {
              window.alert("No results found");
            }
          } else {
            window.alert("Geocoder failed due to: " + status);
          }
        });
      },
      [formData, setFormData]
    );

    const setupAutocomplete = useCallback(() => {
      if (window.google && autocompleteRef.current) {
        let autocompleteOptions;
        if (currentLocation) {
          autocompleteOptions = {
            componentRestrictions: { country },
          };
        } else {
          autocompleteOptions = {};
        }

        const autocomplete = new window.google.maps.places.Autocomplete(
          autocompleteRef.current,
          autocompleteOptions
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const { lat, lng } = place.geometry.location;
            setCurrentLocation({ lat: lat(), lng: lng() });
            setNewInput(place.formatted_address);
            setFormData((prev) => ({
              ...prev,
              address: place.formatted_address,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              country:
                place.address_components.find((component) =>
                  component.types.includes("country")
                )?.short_name || "",
            }));
          }
        });
      }
    }, [currentLocation, country, setFormData]);

    const handleLoadScript = useCallback(() => {
      if (window.google && window.google.maps) {
        if (
          (location.pathname === "/auth/createAccount" ||
            location.pathname === "/auth/workerRegister") &&
          !formData?.latitude &&
          !formData?.longitude
        ) {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;

                const geocoder = new window.google.maps.Geocoder();
                const latLng = { lat: latitude, lng: longitude };

                geocoder.geocode({ location: latLng }, (results, status) => {
                  if (status === "OK" && results[0]) {
                    const countryComponent = results[0].address_components.find(
                      (component) => component.types.includes("country")
                    );
                    setCountry(
                      countryComponent ? countryComponent.short_name : "Unknown"
                    );
                    setNewInput(results[0].formatted_address);
                    setFormData((prev) => ({
                      ...prev,
                      address: results[0].formatted_address,
                    }));
                    setCurrentLocation({
                      lat: latitude,
                      lng: longitude,
                      country,
                    });
                    setSelectedLocation({
                      lat: latitude,
                      lng: longitude,
                      country,
                    });
                    setMapLoaded(true);
                    setInputEnabled(true);
                    setLoading(false);
                  } else {
                    console.error(
                      "Geocoder failed to get country due to:",
                      status
                    );
                    setMapLoaded(true);
                    setCountry("");
                    setLoading(false);
                  }
                });
              },
              (error) => {
                console.error("Error getting user location:", error);
                setMapLoaded(true);
                setInputEnabled(true);
                setLoading(false);
                setCountry("");
              }
            );
          } else {
            console.error("Geolocation is not supported");
            setMapLoaded(true);
            setInputEnabled(true);
            setLoading(false);
            setCountry("");
          }
        } else if (
          location.pathname === "/user/editprofile" ||
          (location.pathname === "/worker/editprofile" && editMode)
        ) {
          setCountry(formData?.country);
          if (editMode) {
            const latitude = UsersData?.latitude;
            const longitude = UsersData?.longitude;
            const userCurrentCountry = UsersData?.country;
            console.log("i ran");
            setTimeout(() => {
              setMapLoaded(true);
              setInputEnabled(true);
              setLoading(false);
            }, 500);
            if (
              latitude !== undefined ||
              (longitude !== undefined && currentLocation === null)
            ) {
              setCurrentLocation({
                lat: latitude,
                lng: longitude,
                country: userCurrentCountry,
              });
            }
          }
        }
      }
    }, [location.pathname, editMode, UsersData]);

    useEffect(() => {
      setLoadScriptKey((prevKey) => prevKey + 1);
    }, [editMode]);

    useEffect(() => {
      if (!window.google || !window.google.maps) {
        handleLoadScript();
      }
    }, [
      location.pathname,
      formData?.latitude,
      formData?.longitude,
      handleLoadScript,
    ]);

    useEffect(() => {
      if (editMode) {
        handleLoadScript();
      }
    }, [editMode, handleLoadScript]);

    useEffect(() => {
      setupAutocomplete();
    }, [currentLocation, country, setupAutocomplete]);

    return (
      <Container>
        <Input
          innerRef={autocompleteRef}
          type="text"
          placeholder={
            isInputEnabled
              ? "Search for a place"
              : "Please allow location access to search for a place"
          }
          value={newInput || ""}
          onChange={(e) => {
            setErrors({ ...errors, address: "" });
            setNewInput(e.target.value);
            setFormData((prev) => ({ ...prev, address: e.target.value }));
          }}
          onDoubleClick={(e) => e.target.select()}
          disabled={!isInputEnabled}
        />
        {errors?.address && (
          <span className="text-danger">{errors.address}</span>
        )}
        <LoadScript
          key={loadScriptKey}
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_API}
          libraries={libraries}
          onLoad={handleLoadScript}
        >
          {isLoading ? (
            <Spinner
              style={{ width: "3rem", height: "3rem", marginTop: "25px" }}
            />
          ) : isMapLoaded ? (
            <GoogleMapContainer
              currentLocation={currentLocation}
              selectedLocation={selectedLocation}
              onMapClick={handleMapClick}
            />
          ) : (
            <div>Map is not loaded yet.</div>
          )}
        </LoadScript>
      </Container>
    );
  }
);

Map.propTypes = {
  setFormData: PropTypes.func.isRequired,
  formData: PropTypes.object,
  editMode: PropTypes.bool,
};

export default Map;
