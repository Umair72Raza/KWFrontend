import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators } from 'reactstrap';

const MessageImagesCarousel = ({ images, isOpen, toggle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const closeCarousel = () => {
    toggle(); // Close the carousel
  }

  const slides = images?.map((image, index) => {
    return (
      <CarouselItem
      className="carousel-item "
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={index}
      >
        <img
          src={`${import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT}${image}`}
          alt={`Image ${index}`}
          className="message-image"
          style={{ maxHeight: "300px", maxWidth: "100%", height: "auto" }} // Adjust these values as needed
        />
      </CarouselItem>
    );
  });

  return (
    <>
    <div className="d-flex flex-column"><IoClose className="text-danger align-self-end fs-3 fw-bold" onClick={closeCarousel} /> 
    <Carousel className="chatCarousel" activeIndex={activeIndex} next={next} previous={previous} isOpen={isOpen} toggle={toggle}>
      <CarouselIndicators items={images} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl  direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
     {/* Close icon */}
    </Carousel>
    </div>
     </>
  );
};

export default MessageImagesCarousel;
