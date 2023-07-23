import { useState, useEffect } from "react";
import "./ScrollToTopButton.css";
import { TiArrowUpOutline } from "react-icons/ti";
export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-to-top-btn ${isVisible ? "show-scroll" : ""}`}
      onClick={scrollToTop}
      style={{
        zIndex: 100,
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "50%",
        width: "50px",
        border: "none",
        height: "50px",
        fontSize: "20px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        opacity: 0,
        transition: "opacity 0.3s ease",
      }}>
      <TiArrowUpOutline />
    </button>
  );
}
