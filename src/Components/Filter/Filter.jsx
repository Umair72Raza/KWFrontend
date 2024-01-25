import React from 'react'
import { filterConstants } from "../../Constants/Constants";
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
          <Label for="sortOption">{filterConstants.Labels.sort1}</Label>
          <Input
            type="select"
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="none">{filterConstants.options.none}</option>
            <option value="highToLowRating">{filterConstants.options.htlR}</option>
            <option value="lowToHighRating">{filterConstants.options.lthR}</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="sortOption2">{filterConstants.Labels.sort2}</Label>
          <Input
            type="select"
            id="sortOption2"
            value={sortOption2}
            onChange={(e) => setSortOption2(e.target.value)}
          >
            <option value="none">{filterConstants.options.none}</option>
            <option value="highToLowDistance">{filterConstants.options.htld}</option>
            <option value="lowToHighDistance">{filterConstants.options.lthd}</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label>{filterConstants.Labels.filter}</Label>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="distanceFilter"
                value={5}
                checked={distanceFilter == 5}
                onChange={(e) => setDistanceFilter(e.target.value)}
              />
              {filterConstants.Labels.l5}
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
              {filterConstants.Labels.l10}
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
              {filterConstants.Labels.l15}
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
              {filterConstants.Labels.l20}
            </Label>
          </FormGroup>
        </FormGroup>
        <FormGroup>
          <Label>{filterConstants.Labels.filter1}</Label>

          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="rateFilter"
                value={10}
                checked={rateFilter == 10}
                onChange={(e) => setRateFilter(e.target.value)}
              />
              {filterConstants.Labels.l6to10}
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
              {filterConstants.Labels.l11to15}
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
              {filterConstants.Labels.l16to20}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="rateFilter"
                value={21}
                checked={rateFilter == 21}
                onChange={(e) => setRateFilter(e.target.value)}
              />
              {filterConstants.Labels.g20}
            </Label>
          </FormGroup>
        </FormGroup>
        <Button color="danger" onClick={clearFilters}>
          {filterConstants.button.clear}
        </Button>
      </Form>
    </>
  )
}

export default Filter