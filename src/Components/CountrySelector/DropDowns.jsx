// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
// import { Country, State, City } from "country-state-city";
// import { RegisterPage } from "../../Constants/Constants";

// const Dropdowns = ({
//   setFormData,
//   errors,
//   setErrors,
//   loading,
//   editMode,
//   formData,
// }) => {
//   const [country, setCountry] = useState("");
//   const [region, setRegion] = useState("");
//   const [city, setCity] = useState("");
//   const [allCountries, setAllCountries] = useState([]);

//   useEffect(() => {
//     setAllCountries(Country.getAllCountries());
//   }, []);

//   useEffect(() => {
//     if (formData) {
//       setCountry(formData?.country || "");
//       setRegion(formData?.region_state || "");
//       setCity(formData?.city || "");
//     }
//   }, [editMode, formData]);

//   const handleCountryChange = (event) => {
//     const selectedCountry = event.target.value;
//     setFormData((prev) => ({ ...prev, country: selectedCountry }));
//     setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
//     setCountry(selectedCountry);

//     // Reset state and city if the country has no states
//     if (!State.getStatesOfCountry(selectedCountry).length) {
//       setRegion("");
//       setCity("");
//     }
//   };

//   const handleRegionChange = (event) => {
//     setFormData((prev) => ({ ...prev, region_state: event.target.value }));
//     setErrors((prevErrors) => ({ ...prevErrors, region_state: "" }));
//     setRegion(event.target.value);
//   };

//   const handleCityChange = (event) => {
//     setFormData((prev) => ({ ...prev, city: event.target.value }));
//     setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
//     setCity(event.target.value);
//   };

//   return (
//     <Container>
//       <Row>
//         <Col md={4}>
//           <FormGroup>
//             <Label for="country" className="fw-semibold">
//               Country
//               <span className="text-danger fw-bold fs-5">
//                 {RegisterPage.FORM_FIELDS.REQUIRED}
//               </span>
//             </Label>
//             <Input
//               type="select"
//               id="country"
//               value={country}
//               onChange={handleCountryChange}
//               className="form-select"
//               required
//               invalid={!!errors.country}
//               disabled={loading}
//             >
//               {!formData && <option value="">Select Country</option>}
//               {formData && !country ? (
//                 <option value={formData.country} selected={true}>
//                   {allCountries.find(
//                     (country) => country.isoCode === formData.country
//                   )?.name || formData.country}
//                 </option>
//               ) : null}

//               {allCountries.map((countryObj) => (
//                 <option
//                   key={countryObj.isoCode}
//                   value={countryObj.isoCode}
//                   selected={country === countryObj.isoCode}
//                 >
//                   {countryObj.name}
//                 </option>
//               ))}
//             </Input>
//             <span className="text-danger">{errors.country}</span>
//           </FormGroup>
//         </Col>
//         <Col md={4}>
//           <FormGroup>
//             <Label for="region" className="fw-semibold">
//               Region/State
//               <span className="text-danger fw-bold fs-5">
//                 {RegisterPage.FORM_FIELDS.REQUIRED}
//               </span>
//             </Label>
//             <Input
//               type="select"
//               id="region"
//               value={region}
//               onChange={handleRegionChange}
//               className="form-select"
//               required={country}
//               invalid={!!errors.region_state}
//               disabled={
//                 !country ||
//                 State.getStatesOfCountry(country).length === 0 ||
//                 loading
//               }
//             >
//               {country ? (
//                 State.getStatesOfCountry(country).length > 0 ? (
//                   <>
//                     <option value="">
//                       Select Region/State
//                       <span className="text-danger fw-bold fs-5">
//                         {RegisterPage.FORM_FIELDS.REQUIRED}
//                       </span>
//                     </option>
//                     {State.getStatesOfCountry(country).map((state) => (
//                       <option
//                         key={state.isoCode}
//                         value={state.isoCode}
//                         selected={formData?.region_state || null}
//                       >
//                         {state.name}
//                       </option>
//                     ))}
//                   </>
//                 ) : (
//                   <option value="">No states available for this country</option>
//                 )
//               ) : (
//                 <option value="" disabled>
//                   Select a country first
//                 </option>
//               )}
//             </Input>
//             <span className="text-danger">{errors.region_state}</span>
//           </FormGroup>
//         </Col>

//         <Col md={4}>
//           <FormGroup>
//             <Label for="city" className="fw-semibold">
//               City
//               <span className="text-danger fw-bold fs-5">
//                 {RegisterPage.FORM_FIELDS.REQUIRED}
//               </span>
//             </Label>
//             <Input
//               type="select"
//               id="city"
//               value={city}
//               onChange={handleCityChange}
//               className="form-select"
//               required={country && region}
//               invalid={!!(region && errors.city)}
//               disabled={
//                 !region ||
//                 City.getCitiesOfState(country, region).length === 0 ||
//                 loading
//               }
//             >
//               {region ? (
//                 City.getCitiesOfState(country, region).length > 0 ? (
//                   <>
//                     <option value="">Select City</option>
//                     {City.getCitiesOfState(country, region).map((city) => (
//                       <option key={city.id} value={city.id}>
//                         {city.name}
//                       </option>
//                     ))}
//                   </>
//                 ) : (
//                   <option value="">No cities available for this state</option>
//                 )
//               ) : (
//                 <option value="" disabled>
//                   Select a region first
//                 </option>
//               )}
//             </Input>
//             {region && <span className="text-danger">{errors.city}</span>}
//           </FormGroup>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Dropdowns;

// import React, { useState, useEffect } from "react";
// import { FormGroup, Label, Input } from "reactstrap";
// import { countriesData } from "../../Constants/Constants.js"; // Import country data

// const Dropdowns = ({
//   setFormData,
//   errors,
//   setErrors,
//   loading,
//   editMode,
//   formData,
// }) => {
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [countryFound, setCountryFound] = useState(null);
//   const [stateFound, setStateFound] = useState(null);

//   useEffect(() => {
//     if (formData) {
//       console.log("I ran");
//       console.log(formData.country);
//       setSelectedCountry(formData.country || "");
//       setSelectedState(formData.region_state || "");
//       setSelectedCity(formData.city || "");
//     }
//   }, [editMode]);

//   // const handleCountryChange = (event) => {
//   //   const selectedCountryCode = event.target.value;
//   //   const country = countriesData.find(
//   //     (country) => country.code === selectedCountryCode
//   //   );
//   //   setSelectedCountry(country);
//   //   setSelectedState(null);
//   //   setSelectedCity(null);

//   //   // Update form data with the selected country's name
//   //   setFormData((prev) => ({ ...prev, country: country.name }));
//   // };

//   const handleCountryChange = (event) => {
//     const selectedCountryCode = event.target.value;
//     const country = countriesData.find(
//       (country) => country.code === selectedCountryCode
//     );
//     console.log("Selected Country:", country);

//     setSelectedCountry(country.name);
//     setCountryFound(country);
//     setSelectedState(null);
//     setSelectedCity(null);
//     setFormData((prev) => ({ ...prev, country: country.name }));
//   };

//   const handleStateChange = (event) => {
//     event.preventDefault();
//     const selectedStateName = event.target.value;
//     console.log("Selected State Name:", selectedStateName);

//     const state = countryFound?.states?.find(
//       (state) => state.name === selectedStateName
//     );
//     console.log("Selected State:", state);

//     setSelectedState(state.name);
//     setStateFound(state)
//     setSelectedCity(null);

//     setFormData((prev) => ({ ...prev, region_state: state.name }));
//   };

//   const handleCityChange = (event) => {
//     const selectedCityName = event.target.value;
//     setSelectedCity(selectedCityName);

//     // Update form data with the selected city
//     setFormData((prev) => ({ ...prev, city: selectedCityName }));
//   };

//   return (
//     <div>
//       <FormGroup>
//         <Label for="country" className="fw-semibold">
//           Country
//           <span className="text-danger fw-bold fs-5">*</span>
//         </Label>
//         <Input
//           type="select"
//           id="country"
//           value={selectedCountry ? selectedCountry.code : ""}
//           onChange={handleCountryChange}
//           className="form-select"
//           required
//           invalid={!!errors.country}
//           disabled={loading}
//         >
//           <option value="">Select Country</option>
//           {countriesData?.map((country) => (
//             <option key={country.code} value={country.code}>
//               {country.name}
//             </option>
//           ))}
//         </Input>
//         <span className="text-danger">{errors.country}</span>
//       </FormGroup>

//       {selectedCountry && (
//         <>
//           <FormGroup>
//             <Label for="state" className="fw-semibold">
//               State
//               <span className="text-danger fw-bold fs-5">*</span>
//             </Label>
//             <Input
//               type="select"
//               id="state"
//               value={selectedState ? selectedState.name : ""}
//               onChange={handleStateChange}
//               className="form-select"
//               required
//               invalid={!!errors.region_state}
//               disabled={loading}
//             >
//               <option value="">Select State</option>

//               {countryFound?.states?.map((state) => (
//                 <option key={state.name} value={state.name}>
//                   {state.name}
//                 </option>
//               ))}
//             </Input>
//             <span className="text-danger">{errors.region_state}</span>
//           </FormGroup>

//           {selectedState && (
//             <FormGroup>
//               <Label for="city" className="fw-semibold">
//                 City
//                 <span className="text-danger fw-bold fs-5">*</span>
//               </Label>
//               <Input
//                 type="select"
//                 id="city"
//                 value={selectedCity || ""}
//                 onChange={handleCityChange}
//                 className="form-select"
//                 required
//                 invalid={!!errors.city}
//                 disabled={loading}
//               >
//                 <option value="">Select City</option>
//                 {stateFound?.cities?.map((city) => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </Input>
//               <span className="text-danger">{errors.city}</span>
//             </FormGroup>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Dropdowns;

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

    setSelectedCountry(country);
    setCountryFound(country);
    setSelectedState(null);
    setSelectedCity(null);
    setFormData((prev) => ({ ...prev, country: country.name }));
  };

  const handleStateChange = (event) => {
    event.preventDefault();
    const selectedStateName = event.target.value;

    const state = countryFound?.states?.find(
      (state) => state.name === selectedStateName
    );

    setSelectedState(state);
    setStateFound(state);
    setSelectedCity(null);

    setFormData((prev) => ({ ...prev, region_state: state.name }));
  };

  const handleCityChange = (event) => {
    const selectedCityName = event.target.value;
    setSelectedCity(selectedCityName);

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
          value={selectedCountry ? selectedCountry.code : ""}
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
