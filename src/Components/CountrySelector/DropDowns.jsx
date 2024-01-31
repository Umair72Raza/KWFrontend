import React, { useEffect, useState } from "react";
import { Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { Country, State, City } from "country-state-city";
import { RegisterPage } from "../../Constants/Constants";

const Dropdowns = ({ setFormData }) => {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  // useEffect(() => {
  //   const states = State.getStatesOfCountry(country);
  //   if (states.length > 0) {
  //     setRegion(states[0].isoCode); // Set the default region/state
  //   } else {
  //     setRegion('');
  //   }
  // }, [country]);

  // useEffect(() => {
  //   const cities = City.getCitiesOfState(country ,region);
  //   if (cities.length > 0) {
  //     setCity(cities[0].name); // Set the default city
  //   } else {
  //     setCity('');
  //   }
  // }, [region]);

  const handleCountryChange = (event) => {
    setFormData((prev) => ({ ...prev, country: event.target.value }));
    setCountry(event.target.value);
  };

  const handleRegionChange = (event) => {
    setFormData((prev) => ({ ...prev, region_state: event.target.value }));
    setRegion(event.target.value);
  };

  const handleCityChange = (event) => {
    setFormData((prev) => ({ ...prev, city: event.target.value }));
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
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </Input>
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
              required
            >
              {country ? (
                <>
                  <option value="">
                    Select Region/State
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </option>
                  {State.getStatesOfCountry(country).map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">Select a country first</option>
              )}
            </Input>
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
              required
            >
              {region ? (
                <>
                  <option value="">Select City</option>
                  {City.getCitiesOfState(country, region).map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">Select a region first</option>
              )}
            </Input>
          </FormGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Dropdowns;
