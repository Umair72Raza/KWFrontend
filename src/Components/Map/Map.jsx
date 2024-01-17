import { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Container, Input } from "reactstrap";
import { useDebounce } from "../../Hooks/Debounce";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { set } from "lodash";

const libraries = [import.meta.env.VITE_GOOGLE_API_LIBARARY];

const Map = ({ setFormData ,formData}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newinput, setNewinput] = useState(formData?.address);
  const [country, setCountry] = useState(formData?.country);
  const autocompleteRef = useRef(null);
  const debouncedAddress = useDebounce(newinput);
  const location = useLocation();
  const [key, setKey] = useState(0);

  const handleLoadScript = () => {
    if (window.google && window.google.maps && navigator.geolocation) {
      if (location.pathname === "/user/editprofile") {
        const latitude = formData?.latitude;
        const longitude = formData?.longitude;

        if (latitude && longitude) {
          // Use latitude and longitude from formData to set current and selected location
        //   setNewinput(formData?.address);
         setCurrentLocation({ lat: latitude, lng: longitude,country });
          // setSelectedLocation({ lat: latitude, lng: longitude,country }); 
          setCountry(formData?.country);
        }
      } else {
        if (
          (location.pathname === "/auth/register" ||
            location.pathname === "/auth/workerRegister") &&
          !formData?.latitude && !formData?.longitude
        ) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
    
              // Get country using reverse geocoding
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
    
                  setCurrentLocation({ lat: latitude, lng: longitude, country });
                  setSelectedLocation({ lat: latitude, lng: longitude, country });
                } else {
                  console.error("Geocoder failed to get country due to:", status);
                }
              });
            },
            (error) => {
              console.error("Error getting user location:", error);
            }
          );
        }
      }

      
    }
  };

  

  useEffect(() => {
    if (location.pathname === "/auth/register") {
      setCurrentLocation(null);
      setSelectedLocation(null);
      setNewinput("");
      setCountry("");
      setKey((prevKey) => prevKey + 1); // Increment key to force remount
    }
  }, [location.pathname]);


  useEffect(() => {
    handleLoadScript();
  },  [location.pathname,formData?.latitude,formData?.longitude]);

  useEffect(() => {
    // Fetch address based on selected location
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
          }));
        } else {
          console.error("Geocoder failed due to:", status);
        }
      });
    }
  }, [selectedLocation]);

  const handleMapClick = (event) => {
    const { latLng } = event;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    setSelectedLocation({ lat: latitude, lng: longitude });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          if(!formData){
            setNewinput(results[0].formatted_address);
            setFormData((prev) => ({
              ...prev,
              address: results[0].formatted_address,
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng(),
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

  useEffect(() => {
    // Initialize Google Autocomplete
    if (window.google && autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          componentRestrictions: { country }, // Set the country for suggestions
        }
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
          }));
        }
      });
    }
  }, [debouncedAddress, country]);

  return (
    <Container>
      <Input
        innerRef={autocompleteRef}
        type="text"
        placeholder="Search for a place"
        value={newinput}
        onChange={(e) => setNewinput(e.target.value)}
        onDoubleClick={(e) => e.target.select()}
      />
      <LoadScript
      key={key}
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_API}
        libraries={libraries}
        onLoad={handleLoadScript}
      >
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "200px",
            margin: "40px 0",
          }}
          center={currentLocation}
          zoom={16}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
          onClick={handleMapClick}
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
      </LoadScript>
    </Container>
  );
};
Map.propTypes = {
  setFormData: PropTypes.func.isRequired,
};

export default Map;
