import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
} from "reactstrap";
import Slider from "react-slick";
import { ChatState } from "../../Context/ChatProvider";
import { GOTOFFER } from "../../Constants/Constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const GotOffer = ({ formattedOfferDetails, onConfirm, onCancel }) => {
  const [showModal, setShowModal] = useState(true);
  const [fullDetailsModal, setFullDetailsModal] = useState(false);
  const [imageDataURL, setImageDataURL] = useState([]);

  const [showMore, setShowMore] = useState(false);

  const formattedDetails = formattedOfferDetails?.details || "";
  const truncatedDetails =
    formattedDetails?.length > 30
      ? formattedDetails.slice(0, 30) + "..."
      : formattedDetails;

  const displayDetails = showMore
    ? formattedOfferDetails?.details
    : truncatedDetails?.slice(0, 30) + "...";
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  let { setGotOffer } = ChatState();

  useEffect(() => {
    const openModal = () => {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      setShowModal(false);
      document.body.style.overflow = "";
    };

    openModal();
    // Clean up function
    return () => {
      closeModal();
    };
  }, []);

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };



  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setGotOffer(false);
    closeModal();
  };

  useEffect(() => {
    // When the component mounts, convert the image file to a data URL
    const blobArray = formattedOfferDetails?.images?.map((image, index) => {
      const blob = new Blob([image], { type: "image/jpeg" });
      return blob;
    });
    setImageDataURL(blobArray);
  }, [formattedOfferDetails.images]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setGotOffer(false);
    closeModal();
  };

  // const CustomPrevArrow = (props) => {
  //   const { onClick } = props;
  //   return (
  //     <Button
  //       className="  custom-prev-arrow "
  //       onClick={onClick}
  //     >
  //     prev
  //     </Button>
  //   );
  // };

  // const CustomNextArrow = (props) => {
  //   const { onClick } = props;
  //   return (
  //     <div><Button
  //       className=" custom-next-arrow  "
  //       onClick={onClick}
  //     >
  //     next
  //     </Button></div>
  //   );
  // };
  const settings = {
    mobileFirst: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    //  prevArrow: <CustomPrevArrow />,
    //  nextArrow: <CustomNextArrow />,
  };

  return (
    <div>
      <Modal isOpen={showModal} keyboard={false} centered>
        <ModalHeader>{GOTOFFER.OFFER_HEADER}</ModalHeader>
        <ModalBody>
          <p>
            <strong>{GOTOFFER.OFFER_TITLE}</strong>{" "}
            {formattedOfferDetails?.Title}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_DATE}</strong> {formattedOfferDetails?.date}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_TIME}</strong> {formattedOfferDetails?.time}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_AMOUNT}</strong>$
            {formattedOfferDetails?.amount}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_SERVICE}</strong>{" "}
            {formattedOfferDetails?.service}
          </p>
          <p style={{ maxHeight: "100px", overflowY: "scroll" }}>
            <strong>{GOTOFFER.OFFER_DETAILS}</strong>
            <div
              style={{
                whiteSpace: "pre-wrap",
                maxHeight: showMore ? "none" : "100px",
                overflow: "hidden",
              }}
            >
              {displayDetails.replace(/<br\s*\/?>/gi, "\n")}
            </div>
            {truncatedDetails.length > 30 && (
              <Button
              color="primary"
                onClick={toggleShowMore}
                style={{ cursor: "pointer", marginTop: "5px" }}
              >
                {showMore ? "Show Less" : "Show More"}
              </Button>
            )}
          </p>

          <p>
            <strong>Task Pictures</strong>
          </p>
          <Row className="" >
            
           <Col>
              { imageDataURL?.length>2 ? 
              <Slider {...settings} className=" m-5">
                {imageDataURL?.map((image, index) => (
                  <div className="" key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Modal Image ${index}`}
                      className="img-fluid thumbnail"
                    />
                  </div>
                ))}
              </Slider> : 
               <><div className="d-flex">
                {imageDataURL?.map((image, index) => (
                <div className="border" key={index}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Modal Image ${index}`}
                    className="img-fluid thumbnail"
                  />
                </div>
              ))}
              </div></>} 
              </Col>
          
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirm}>
            {GOTOFFER.ACCEPT_BUTTON}
          </Button>{" "}
          <Button color="danger" onClick={handleCancel}>
            {GOTOFFER.REJECT_BUTTON}
          </Button>{" "}
        </ModalFooter>
      </Modal>

    </div>
  );
};

export default GotOffer;
