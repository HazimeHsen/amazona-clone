import React, { useState, useEffect } from "react";
import SwiperCore, { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "./Slider.css"; // Import the CSS file for the ImageSlider component
// Install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const ImageSlider = ({ images }) => {
  const [slider, setSlider] = useState(null); // State to store the Swiper instance
  const [imageList, setImageList] = useState(images); // State to store the list of images
  const [isGrabbing, setIsGrabbing] = useState(false); // State to track grabbing state
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // ...

  // Update the handleSlideChange function to be debounced
  const handleSlideChange = debounce(() => {
    const currentIndex = slider?.realIndex; // Get the current slide index using realIndex
    const lastIndex = imageList.length - 1; // Get the index of the last image in the array
    if (currentIndex === lastIndex || currentIndex + 1 === lastIndex) {
      // If the current slide is the last slide
      // Add the three images again to the images array
      setImageList([...imageList, ...images.slice(0, images.length)]);
    }
  }, 500); // Adjust the delay value as needed (in milliseconds)

  useEffect(() => {
    if (slider) {
      // Add event listener for Swiper's touchStart event
      slider.on("touchStart", () => {
        setIsGrabbing(true); // Set grabbing state to true
      });

      // Add event listener for Swiper's touchEnd event
      slider.on("touchEnd", () => {
        setIsGrabbing(false); // Set grabbing state to false
      });
    }
  }, [slider]);

  return (
    <Swiper
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
      className={`image-slider-container ${
        isGrabbing ? "swiper-grabbing" : "swiper-grab"
      }`} // Add grabbing class conditionally
      onSwiper={setSlider} // Set the Swiper instance to the state
      onSlideChange={handleSlideChange} // Set the event handler for Swiper's onSlideChange event
    >
      {imageList.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} alt={`images${index + 1}`} className="image-slide" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
