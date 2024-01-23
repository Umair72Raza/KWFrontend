import { toast } from "react-toastify";

import { jwtDecode } from "jwt-decode";

export const Toast_Notification = (string, type) => {
  toast[type](string, {
    position: toast.POSITION.TOP_CENTER,
  });
};

export const Logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return "200";
};

export const checkRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const role = user.role;
    return role;
  }
};


export const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const transformOrderDetails = (order, showFullDetailsMap) => {
  let transformedDetails = order.details.replace(/<br\s*\/?>/g, "\n");

  return showFullDetailsMap[order._id]
    ? order.details
    : truncateText(transformedDetails, 25);
};

export const toggleDetails = (prevMap, orderId) => {
  return {
    ...prevMap,
    [orderId]: !prevMap[orderId],
  };
};


export const checkToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken; // Return decoded token if valid
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return null; // No token found
};

export const validatePassword = (password) => {
  // Password pattern with disallowance of spaces
  const passwordPattern = /^(?=.*[!@#$%^&*?])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;;

  return password.match(passwordPattern);
};


export const hasOnlyWhiteSpace = (str) => {
  return !str?.trim();
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const handleNameChange = (formData, setFormData, setErrors,errors, fieldName, e) => {
  const { value } = e.target;
  setErrors({ ...errors, [fieldName]: "" });
  // Check if the entered value is a valid string (only letters and spaces)
  const isValidString = /^[a-zA-Z\s]*$/.test(value);

  if (isValidString) {
    // Trim spaces from the beginning and end, replace consecutive spaces with a single space
    const cleanedValue = value.trimStart().replace(/ +/g, " ");

    // Capitalize the cleaned value
    const capitalizedValue = capitalizeFirstLetter(cleanedValue);

    setFormData({
      ...formData,
      [fieldName]: capitalizedValue,
    });
  }

};


export const validateEmail = (email) => {
  const trimmedEmail = email.trim(); // Remove leading and trailing spaces
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@0-9]{2,}$/;
  return trimmedEmail.match(emailPattern);
};

export const validatePhoneNumber = (phoneNumber) => {
  const phonePattern = /^\d{10}$/;
  return phoneNumber.match(phonePattern);
};

export const successToast = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000, // Duration in milliseconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};



export const failureToast = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// select the to show

export const SelectChat = (chat) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (chat && chat.users && Array.isArray(chat.users)) {
    const otherUser = chat.users.find((u) => u._id !== user._id);

    if (otherUser) {
      return otherUser;
    } else {
      console.log("No other user found in this chat");
      // Optionally handle the case where there's no other user
    }
  } else {
    console.log("Invalid chat or users array");
    // Handle cases where the chat or users array is null or not an array
  }
};

export const loadGoogleMapsScript = (apiKey, callback) => {
  const googleMapsScript = document.createElement("script");
  googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callback}`;
  googleMapsScript.async = true;
  googleMapsScript.defer = true;
  document.head.appendChild(googleMapsScript);
};

export const initMap = (setAutocomplete, setAddress, setFormData) => {
  const google = window.google;
  const autocompleteService = new google.maps.places.AutocompleteService();
  const newAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById("address"),
    {
      componentRestrictions: { country: "PK" },
    }
  );

  setAutocomplete(newAutocomplete);

  newAutocomplete.addListener("place_changed", () => {
    const place = newAutocomplete.getPlace();
    setAddress(place.formatted_address);
    if (
      place &&
      place.formatted_address &&
      place.geometry &&
      place.geometry.location
    ) {
      setFormData((prev) => ({
        ...prev,
        address: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      }));
    }
  });
};

export const getPlacePredictions = (debouncedAddress, autocomplete) => {
  if (autocomplete) {
    const google = window.google;
    const autocompleteService = new google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      { input: debouncedAddress },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Handle predictions here
          console.log(predictions);
        } else {
          // Handle error
          console.error(`Error fetching predictions: ${status}`);
        }
      }
    );
  }
};

// get the current location of the user

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({
            latitude,
            longitude,
            error: null,
          });
        },
        (error) => {
          reject({
            latitude: null,
            longitude: null,
            error: error.message,
          });
        }
      );
    } else {
      reject({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
      });
    }
  });
};
