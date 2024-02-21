import React, { useState, useEffect } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import { countriesData } from "../../Constants/Constants.js"; // Import country data

const Dropdowns = ({
  setFormData,
  errors,
  setErrors,
  loading,
  editMode,
  formData,
  UserData,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [countryFound, setCountryFound] = useState(null);
  const [stateFound, setStateFound] = useState(null);

  useEffect(() => {
    if (formData) {
      console.log(formData.country);
      setSelectedCountry(formData.country || "");
      setSelectedState(formData.region_state || "");
      setSelectedCity(formData.city || "");
    }
  }, [formData, editMode]);

  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    const country = countriesData.find(
      (country) => country.code === selectedCountryCode
    );
    setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
    setSelectedCountry(country);
    setCountryFound(country);
    setSelectedState(null);
    setSelectedCity(null);
    setFormData((prev) => ({ ...prev, country: country?.name }));
  };

  const handleStateChange = (event) => {
    event.preventDefault();
    const selectedStateName = event.target.value;
    const state = countryFound?.states?.find(
      (state) => state?.name === selectedStateName
    );
    setErrors((prevErrors) => ({ ...prevErrors, region_state: "" }));
    setSelectedState(state);
    setStateFound(state);
    setSelectedCity(null);
    setFormData((prev) => ({ ...prev, region_state: state?.name }));
  };

  const handleCityChange = (event) => {
    const selectedCityName = event.target.value;
    setSelectedCity(selectedCityName);
    setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
    setFormData((prev) => ({ ...prev, city: selectedCityName }));
  };

  return (
    <div>
      <FormGroup>
        <Label for="country" className="fw-semibold">
          Country
          <span className="text-danger fw-bold fs-5">*</span>
        </Label>
        <Input
          type="select"
          id="country"
          value={selectedCountry ? selectedCountry?.code : ""}
          onChange={handleCountryChange}
          className="form-select"
          required
          invalid={!!errors.country}
          disabled={loading}
        >
          <option value="">Select Country</option>
          {countriesData?.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </Input>
        <span className="text-danger">{errors.country}</span>
      </FormGroup>

      {selectedCountry && (
        <>
          <FormGroup>
            <Label for="state" className="fw-semibold">
              State
              <span className="text-danger fw-bold fs-5">*</span>
            </Label>
            <Input
              type="select"
              id="state"
              value={selectedState ? selectedState.name : ""}
              onChange={handleStateChange}
              className="form-select"
              required
              invalid={!!errors.region_state}
              disabled={loading}
            >
              <option value="">Select State</option>

              {countryFound?.states?.map((state) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </Input>
            <span className="text-danger">{errors.region_state}</span>
          </FormGroup>

          {selectedState && (
            <FormGroup>
              <Label for="city" className="fw-semibold">
                City
                <span className="text-danger fw-bold fs-5">*</span>
              </Label>
              <Input
                type="select"
                id="city"
                value={selectedCity || ""}
                onChange={handleCityChange}
                className="form-select"
                required
                invalid={!!errors.city}
                disabled={loading}
              >
                <option value="">Select City</option>
                {stateFound?.cities?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Input>
              <span className="text-danger">{errors.city}</span>
            </FormGroup>
          )}
        </>
      )}
    </div>
  );
};

export default Dropdowns;
