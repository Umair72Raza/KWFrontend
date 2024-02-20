import React, { useEffect, useState } from "react";
import { Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
// import { Country, State, City } from "country-state-city";
import { RegisterPage } from "../../Constants/Constants";

const Dropdowns = ({
  setFormData,
  errors,
  setErrors,
  loading,
  editMode,
  formData,
}) => {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    setAllCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if ( formData) {
      setCountry(formData?.country || "");
      setRegion(formData?.region_state || "");
      setCity(formData?.city || "");
    }
  }, [editMode, formData]);

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setFormData((prev) => ({ ...prev, country: selectedCountry }));
    setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
    setCountry(selectedCountry);

    // Reset state and city if the country has no states
    if (!State.getStatesOfCountry(selectedCountry).length) {
      setRegion("");
      setCity("");
    }
  };

  const handleRegionChange = (event) => {
    setFormData((prev) => ({ ...prev, region_state: event.target.value }));
    setErrors((prevErrors) => ({ ...prevErrors, region_state: "" }));
    setRegion(event.target.value);
  };

  const handleCityChange = (event) => {
    setFormData((prev) => ({ ...prev, city: event.target.value }));
    setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
    setCity(event.target.value);
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <FormGroup>
            <Label for="country" className="fw-semibold">
              Country
              <span className="text-danger fw-bold fs-5">
                {RegisterPage.FORM_FIELDS.REQUIRED}
              </span>
            </Label>
            <Input
              type="select"
              id="country"
              value={country}
              onChange={handleCountryChange}
              className="form-select"
              required
              invalid={!!errors.country}
              disabled={loading}
            >
             {!formData && (<option value="">Select Country</option>)} 
              {formData && !country ? (
                <option value={formData.country} selected={true}>
                  {allCountries.find(
                    (country) => country.isoCode === formData.country
                  )?.name || formData.country}
                </option>
              ) : null}

              {allCountries.map((countryObj) => (
                <option
                  key={countryObj.isoCode}
                  value={countryObj.isoCode}
                  selected={country === countryObj.isoCode}
                >
                  {countryObj.name}
                </option>
              ))}
            </Input>
            <span className="text-danger">{errors.country}</span>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="region" className="fw-semibold">
              Region/State
              <span className="text-danger fw-bold fs-5">
                {RegisterPage.FORM_FIELDS.REQUIRED}
              </span>
            </Label>
            <Input
              type="select"
              id="region"
              value={region}
              onChange={handleRegionChange}
              className="form-select"
              required = {country}
              invalid={!!errors.region_state}
              disabled={
                !country ||
                State.getStatesOfCountry(country).length === 0 ||
                loading
              }
            >
              {country ? (
                State.getStatesOfCountry(country).length > 0 ? (
                  <>
                    <option value="">
                      Select Region/State
                      <span className="text-danger fw-bold fs-5">
                        {RegisterPage.FORM_FIELDS.REQUIRED}
                      </span>
                    </option>
                    {State.getStatesOfCountry(country).map((state) => (
                      <option key={state.isoCode} value={state.isoCode} selected={formData?.region_state || null}>
                        {state.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No states available for this country</option>
                )
              ) : (
                <option value="" disabled>
                  Select a country first
                </option>
              )}
            </Input>
            <span className="text-danger">{errors.region_state}</span>
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="city" className="fw-semibold">
              City
              <span className="text-danger fw-bold fs-5">
                {RegisterPage.FORM_FIELDS.REQUIRED}
              </span>
            </Label>
            <Input
              type="select"
              id="city"
              value={city}
              onChange={handleCityChange}
              className="form-select"
              required = {country && region}
              invalid={!!(region && errors.city)}
              disabled={
                !region ||
                City.getCitiesOfState(country, region).length === 0 ||
                loading
              }
            >
              {region ? (
                City.getCitiesOfState(country, region).length > 0 ? (
                  <>
                    <option value="">Select City</option>
                    {City.getCitiesOfState(country, region).map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No cities available for this state</option>
                )
              ) : (
                <option value="" disabled>
                  Select a region first
                </option>
              )}
            </Input>
            {region && <span className="text-danger">{errors.city}</span>}
          </FormGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Dropdowns;
