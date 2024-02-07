import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import Slider from "react-slick";
import { truncateText } from "../../utils";
import { FiMessageCircle } from "react-icons/fi";

const OpenJobs = ({ spinnerVisible, scheduledOrdersObject }) => {
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const [imageDataURL, setImageDataURL] = useState([]);

  useEffect(() => {
    // Convert image URLs to Blob objects
    const blobArray = scheduledOrdersObject.map((order) => {
      return order.images.map((image) => {
        return new Blob([image], { type: "image/jpeg" });
      });
    });
    setImageDataURL(blobArray);
  }, [scheduledOrdersObject]);

  const transformOrderDetails = (order) => {
    let transformedDetails = order.details?.replace(/<br\s*\/?>/g, "\n");
    return showFullDetailsMap[order.id]
      ? order.details
      : truncateText(transformedDetails, 30);
  };

  const toggleDetails = (orderId) => {
    setShowFullDetailsMap((prevMap) => ({
      ...prevMap,
      [orderId]: !prevMap[orderId],
    }));
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const getCorrectImageUrl = (imageName) => {
    const extensions = ["jpg", "jpeg", "png", "gif"]; // List of possible image extensions
    const baseUrl =
      import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT + "upload/orderImages/"; // Base URL for the images

    // Iterate through each extension and check if the image with that extension exists
    for (const ext of extensions) {
      const imageUrl = `${baseUrl}${imageName}.${ext}`;
      // Check if the image exists by attempting to load it
      const image = new Image();
      image.src = imageUrl;
      if (image.width > 0 && image.height > 0) {
        // If the image loads successfully, return its URL
        return imageUrl;
      }
    }

    // If no valid image URL is found, return a placeholder image or an error image URL
    return "placeholder_image_url.jpg"; // Replace "placeholder_image_url.jpg" with your desired fallback image URL
  };

  return (
    <Container>
      {spinnerVisible ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        <>
          <Row>
            {scheduledOrdersObject?.map((order) => (
              <Col
                key={order.id}
                sm="6"
                md="4"
                lg="4"
                style={{ marginTop: "10px" }}
              >
                <Card
                  className="shadow"
                  style={{ backgroundColor: "#f6f8fc", height: "100%" }}
                >
                  <CardBody>
                    <h5
                      style={{
                        marginTop: "4%",
                        textAlign: "center",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {order?.Title}
                    </h5>
                    <CardText>
                      <b>Posted by:</b> {order?.user?.firstName}{" "}
                      {order?.user?.lastName}
                    </CardText>
                    <CardText>
                      <b>Time:</b> {order?.time}
                    </CardText>
                    <CardText>
                      <b>Date:</b> {order?.date}
                    </CardText>
                    <CardText>
                      <b>Amount:</b> ${order?.amount}
                    </CardText>
                    <CardText>
                      <b>Address:</b> {order?.Address}
                    </CardText>
                    <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                      {order?.service && order.service.length > 0 && (
                        <CardText>
                          <b>Services:</b>
                          <ul
                            style={{
                              listStyleType: "none",
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            {order?.service?.map((s, index) => (
                              <li key={index}>{s}</li>
                            ))}
                          </ul>
                        </CardText>
                      )}
                    </div>
                    <CardText>
                      <b>Details:</b>{" "}
                      <div
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                      >
                        {showFullDetailsMap[order.id] ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: order.details,
                            }}
                          />
                        ) : (
                          transformOrderDetails(order)
                        )}
                        {order.details?.length > 30 && (
                          <Button
                            style={{ marginTop: "-5px" }}
                            color="link"
                            onClick={() => toggleDetails(order.id)}
                          >
                            {showFullDetailsMap[order.id]
                              ? "Show Less"
                              : "Show More"}
                          </Button>
                        )}
                      </div>
                    </CardText>
                    {order.images.length > 0 && (
                      <CardText className="mb-3">
                        <b>Images:</b>
                        {order.images?.length > 0 && (
                          <Row>
                            <Slider {...settings} className="">
                              {order.images?.map((image, index) => (
                                <div key={index}>
                                  <img
                                    key={index}
                                    src={getCorrectImageUrl(image)}
                                    alt={`Modal Image ${index}`}
                                    className="img-fluid "
                                  />
                                </div>
                              ))}
                            </Slider>
                          </Row>
                        )}
                      </CardText>
                    )}
                    <CardText className="d-flex justify-content-around align-items-center">
                      <Button color="primary">Accept</Button>

                      <FiMessageCircle
                        className="fs-3 hover-pointer"
                        // onClick={handleMessageIconClick}
                      />
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default OpenJobs;
