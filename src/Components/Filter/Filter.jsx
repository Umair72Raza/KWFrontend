import React from 'react'
import { button, Labels, options } from "./constants.js";
import {
  Input,
  Form,
  FormGroup,
  Label,
  Button
} from "reactstrap";
const Filter = ({ sortOption, setSortOption, sortOption2,
  setSortOption2, distanceFilter, setDistanceFilter, rateFilter,
  setRateFilter, clearFilters }) => {
  return (
    <>
      <Form>
        <FormGroup>
          <Label for="sortOption">{Labels.sort1}</Label>
          <Input
            type="select"
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="none">{options.none}</option>
            <option value="highToLowRating">{options.htlR}</option>
            <option value="lowToHighRating">{options.lthR}</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="sortOption2">{Labels.sort2}</Label>
          <Input
            type="select"
            id="sortOption2"
            value={sortOption2}
            onChange={(e) => setSortOption2(e.target.value)}
          >
            <option value="none">{options.none}</option>
            <option value="highToLowDistance">{options.htld}</option>
            <option value="lowToHighDistance">{options.lthd}</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label>{Labels.filter}</Label>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="distanceFilter"
                value={5}
                checked={distanceFilter == 5}
                onChange={(e) => setDistanceFilter(e.target.value)}
              />
              {Labels.l5}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="distanceFilter"
                value={10}
                checked={distanceFilter == 10}
                onChange={(e) => setDistanceFilter(e.target.value)}
              />
              {Labels.l10}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="distanceFilter"
                value={15}
                checked={distanceFilter == 15}
                onChange={(e) => setDistanceFilter(e.target.value)}
              />
              {Labels.l15}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="distanceFilter"
                value={20}
                checked={distanceFilter == 20}
                onChange={(e) => setDistanceFilter(e.target.value)}
              />
              {Labels.l20}
            </Label>
          </FormGroup>
        </FormGroup>
        <FormGroup>
          <Label>{Labels.filter1}</Label>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="rateFilter"
                value={5}
                checked={rateFilter == 5}
                onChange={(e) => setRateFilter(e.target.value)}
              />
              {Labels.l1to5}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="rateFilter"
                value={10}
                checked={rateFilter == 10}
                onChange={(e) => setRateFilter(e.target.value)}
              />
              {Labels.l6to10}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="rateFilter"
                value={15}
                checked={rateFilter == 15}
                onChange={(e) => setRateFilter(e.target.value)}
              />
              {Labels.l11to15}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="rateFilter"
                value={20}
                checked={rateFilter == 20}
                onChange={(e) => setRateFilter(e.target.value)}
              />
              {Labels.l16to20}
            </Label>
          </FormGroup>
        </FormGroup>
        <Button color="danger" onClick={clearFilters}>
          {button.clear}
        </Button>
      </Form>
    </>
  )
}

export default Filter