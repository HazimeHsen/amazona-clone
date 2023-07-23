import React from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

export default function StarsComponent({ stars, setStars, click }) {
  function doNothing() {
    // do nothing
  }
  return (
    <div className={click ? " rating clicking" : "rating"}>
      <span
        onClick={(e) => {
          click ? setStars(1) : doNothing();
        }}>
        {stars >= 1 ? (
          <BsStarFill />
        ) : stars >= 0.5 ? (
          <BsStarHalf />
        ) : (
          <BsStar />
        )}
      </span>
      <span
        onClick={(e) => {
          click ? setStars(2) : doNothing();
        }}>
        {stars >= 2 ? (
          <BsStarFill />
        ) : stars >= 1.5 ? (
          <BsStarHalf />
        ) : (
          <BsStar />
        )}
      </span>
      <span
        onClick={(e) => {
          click ? setStars(3) : doNothing();
        }}>
        {stars >= 3 ? (
          <BsStarFill />
        ) : stars >= 2.5 ? (
          <BsStarHalf />
        ) : (
          <BsStar />
        )}
      </span>
      <span
        onClick={(e) => {
          click ? setStars(4) : doNothing();
        }}>
        {stars >= 4 ? (
          <BsStarFill />
        ) : stars >= 3.5 ? (
          <BsStarHalf />
        ) : (
          <BsStar />
        )}
      </span>
      <span
        onClick={(e) => {
          click ? setStars(5) : doNothing();
        }}>
        {stars >= 5 ? (
          <BsStarFill />
        ) : stars >= 4.5 ? (
          <BsStarHalf />
        ) : (
          <BsStar />
        )}
      </span>
    </div>
  );
}
