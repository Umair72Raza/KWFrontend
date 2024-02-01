import React from 'react'
import { filterConstants } from "../../Constants/Constants";
import {
  Input,
  Form,
  FormGroup,
  Label,
  Button,
  Col,
  Container,
  Row
} from "reactstrap";
const Filter = ({ sortOption, setSortOption, sortOption2,
  setSortOption2, distanceFilter, setDistanceFilter, rateFilter,
  setRateFilter, clearFilters }) => {
  return (
     <Container className='pl-4 pr-4 px-3'>
     
      <Form >
      <Row className='d-flex flex-column flex-md-row '>
        <Col md={4} xl={3} ><FormGroup>
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
        </FormGroup></Col>
        <Col md={3} xl={3} className='d-flex justify-content-md-center'><FormGroup>
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
        </FormGroup></Col>
        <Col md={4} xl={3}><FormGroup>
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
        </FormGroup></Col>
        <Button className='d-md-none d-sm-block ' color="danger" onClick={clearFilters}>
          {filterConstants.button.clear}
        </Button>
        </Row>
      </Form>
    
     </Container>
  )
}

export default Filter