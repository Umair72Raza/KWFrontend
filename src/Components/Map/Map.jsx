import { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Container, Input } from "reactstrap";
import { useDebounce } from "../../Hooks/Debounce";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const libraries = [import.meta.env.VITE_GOOGLE_API_LIBARARY];

const GoogleMapContainer = ({
  currentLocation,
  selectedLocation,
  onMapClick,
}) => {
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
};

GoogleMapContainer.propTypes = {
  currentLocation: PropTypes.object,
  selectedLocation: PropTypes.object,
  onMapClick: PropTypes.func.isRequired,
};

const Map = ({ setFormData, formData }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newinput, setNewinput] = useState(formData?.address);
  const [country, setCountry] = useState(formData?.country);
  const autocompleteRef = useRef(null);
  const debouncedAddress = useDebounce(newinput);
  const location = useLocation();
  const [loadScriptKey, setLoadScriptKey] = useState(0);
  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isInputEnabled, setInputEnabled] = useState(false);
  const { UsersData } = useSelector((state) => state.editProfile);

  useEffect(() => {
    if (location.pathname === "/user/editprofile") {
      const latitude = UsersData?.latitude;
      const longitude = UsersData?.longitude;
      const userCurrentCountry = UsersData?.country;

      if (latitude && longitude) {
        // Use latitude and longitude from formData to set current and selected location
        setCurrentLocation({
          lat: latitude,
          lng: longitude,
          country: userCurrentCountry,
        });
        setCountry(formData?.country);
      }
    }
  }, []);

  //   const handleLoadScript = () => {
  //     if (window.google && window.google.maps && navigator.geolocation) {
  //         if (
  //           (location.pathname === "/auth/register" ||
  //             location.pathname === "/auth/workerRegister") &&
  //           !formData?.latitude &&
  //           !formData?.longitude
  //         ) {
  //           navigator.geolocation.getCurrentPosition(
  //             (position) => {
  //               const { latitude, longitude } = position.coords;

  //               // Get country using reverse geocoding
  //               const geocoder = new window.google.maps.Geocoder();
  //               const latlng = { lat: latitude, lng: longitude };

  //               geocoder.geocode({ location: latlng }, (results, status) => {
  //                 if (status === "OK" && results[0]) {
  //                   const countryComponent = results[0].address_components.find(
  //                     (component) => component.types.includes("country")
  //                   );
  //                   setCountry(
  //                     countryComponent ? countryComponent.short_name : "Unknown"
  //                   );

  //                   setCurrentLocation({
  //                     lat: latitude,
  //                     lng: longitude,
  //                     country,
  //                   });
  //                   setSelectedLocation({
  //                     lat: latitude,
  //                     lng: longitude,
  //                     country,
  //                   });
  //                 } else {
  //                   console.error(
  //                     "Geocoder failed to get country due to:",
  //                     status
  //                   );
  //                 }
  //               });
  //             },
  //             (error) => {
  //               console.error("Error getting user location:", error);
  //             }
  //           );
  //         }

  //     }
  //   };

  //   useEffect(() => {
  //     if (
  //       location.pathname === "/auth/register"
  //     ) {
  //       setCurrentLocation(null);
  //       setSelectedLocation(null);
  //       setNewinput("");
  //       setCountry("");
  //       setKey((prevKey) => prevKey + 1); // Increment key to force remount
  //     }
  //   }, [location.pathname]);

  //   useEffect(() => {
  //     handleLoadScript();
  //   }, [location.pathname, formData?.latitude, formData?.longitude]);

  //   useEffect(() => {
  //     // Fetch address based on selected location
  //     if (selectedLocation) {
  //       const geocoder = new window.google.maps.Geocoder();
  //       geocoder.geocode({ location: selectedLocation }, (results, status) => {
  //         if (status === "OK" && results[0]) {
  //           setNewinput(results[0].formatted_address);
  //           setFormData((prev) => ({
  //             ...prev,
  //             address: results[0].formatted_address,
  //             latitude: results[0].geometry.location.lat(),
  //             longitude: results[0].geometry.location.lng(),
  //           }));
  //         } else {
  //           console.error("Geocoder failed due to:", status);
  //         }
  //       });
  //     }
  //   }, [selectedLocation]);

  //   const handleMapClick = (event) => {
  //     const { latLng } = event;
  //     const latitude = latLng.lat();
  //     const longitude = latLng.lng();

  //       setSelectedLocation({ lat: latitude, lng: longitude });

  //     const geocoder = new window.google.maps.Geocoder();
  //     geocoder.geocode({ location: latLng }, (results, status) => {
  //       if (status === "OK") {
  //         if (results[0]) {
  //           if (!formData) {
  //             setNewinput(results[0].formatted_address);
  //             setFormData((prev) => ({
  //               ...prev,
  //               address: results[0].formatted_address,
  //               latitude: results[0].geometry.location.lat(),
  //               longitude: results[0].geometry.location.lng(),
  //             }));
  //           } else {
  //             setNewinput(formData?.address);
  //           }
  //         } else {
  //           window.alert("No results found");
  //         }
  //       } else {
  //         window.alert("Geocoder failed due to: " + status);
  //       }
  //     });
  //   };

  //   useEffect(() => {
  //     // Initialize Google Autocomplete
  //     if (window.google && autocompleteRef.current) {
  //       const autocomplete = new window.google.maps.places.Autocomplete(
  //         autocompleteRef.current,
  //         {
  //           componentRestrictions: { country }, // Set the country for suggestions
  //         }
  //       );
  //       autocomplete.addListener("place_changed", () => {
  //         const place = autocomplete.getPlace();
  //         if (place.geometry) {
  //           const { lat, lng } = place.geometry.location;
  //           setCurrentLocation({ lat: lat(), lng: lng() });
  //           setNewinput(place.formatted_address);
  //           setFormData((prev) => ({
  //             ...prev,
  //             address: place.formatted_address,
  //             latitude: place.geometry.location.lat(),
  //             longitude: place.geometry.location.lng(),
  //           }));
  //         }
  //       });
  //     }
  //   }, [debouncedAddress, country]);

  const handleMapClick = (event) => {
    const { latLng } = event;
    const latitude = latLng.lat();
    const longitude = latLng.lng();

    setSelectedLocation({ lat: latitude, lng: longitude });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          if (!formData) {
            setNewinput(results[0].formatted_address);
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
            setNewinput(formData?.address);
          }
        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    });
  };

  const setupAutocomplete = () => {
    if (window.google && autocompleteRef.current) {
      let autocompleteOPtions;
      if (currentLocation) {
        autocompleteOPtions = {
          componentRestrictions: { country },
        };
      } else {
        autocompleteOPtions = {};
      }

      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        autocompleteOPtions
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const { lat, lng } = place.geometry.location;
          setCurrentLocation({ lat: lat(), lng: lng() });
          setNewinput(place.formatted_address);
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
  };

  const handleLoadScript = () => {
    if (window.google && window.google.maps) {
      if (
        (location.pathname === "/auth/register" ||
          location.pathname === "/auth/workerRegister") &&
        !formData?.latitude &&
        !formData?.longitude
      ) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              const geocoder = new window.google.maps.Geocoder();
              const latlng = { lat: latitude, lng: longitude };

              geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === "OK" && results[0]) {
                  const countryComponent = results[0].address_components.find(
                    (component) => component.types.includes("country")
                  );
                  setCountry(
                    countryComponent ? countryComponent.short_name : "Unknown"
                  );

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
                  setInputEnabled(true); // Enable input field when map is loaded
                } else {
                  console.error(
                    "Geocoder failed to get country due to:",
                    status
                  );
                  setMapLoaded(true); // Ensure setMapLoaded is called even if geocoding fails
                  setCountry("");
                }
              });
            },
            (error) => {
              console.error("Error getting user location:", error);
              setMapLoaded(true);
              setInputEnabled(true);
              setCountry("");
            }
          );
        } else {
          console.error("Geolocation is not supported");
          setMapLoaded(true);
          setInputEnabled(true);
          setCountry("");
        }
      } else {
        setMapLoaded(true);
        setInputEnabled(true); // Enable input field when not in registration
        setCountry("");
      }
    }
  };

  useEffect(() => {
    setLoadScriptKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    handleLoadScript();
  }, [location.pathname, formData?.latitude, formData?.longitude]);

  useEffect(() => {
    if (selectedLocation) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: selectedLocation }, (results, status) => {
        if (status === "OK" && results[0]) {
          setNewinput(results[0].formatted_address);
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
          console.error("Geocoder failed due to:", status);
        }
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    setupAutocomplete();
  }, [newinput, country]);

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
        value={newinput}
        onChange={(e) => setNewinput(e.target.value)}
        onDoubleClick={(e) => e.target.select()}
        disabled={!isInputEnabled}
      />
      <LoadScript
        key={loadScriptKey}
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_API}
        libraries={libraries}
        onLoad={() => handleLoadScript()}
      >
        {isMapLoaded && (
          <GoogleMapContainer
            currentLocation={currentLocation}
            selectedLocation={selectedLocation}
            onMapClick={handleMapClick}
          />
        )}
      </LoadScript>
    </Container>
  );
};

Map.propTypes = {
  setFormData: PropTypes.func.isRequired,
  formData: PropTypes.object,
};

export default Map;
