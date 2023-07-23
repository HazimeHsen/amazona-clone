import React, { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../../../Rating/Rating";
import { Store } from "../../../Store/Store";
import axios from "axios";
import "./MainScreenComponents.css";
import ImageSlider from "../../../Slider/Slider";

const MainScreenComponents = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("no items");
      return;
    }
    ctxDispatch({ type: "ADD_ITEM", payload: { ...product, quantity } });
  };
  return (
    <>
      <Card>
        <div className="slider-handler">
          <ImageSlider images={product.image} />
        </div>
        <Card.Body className="product-info">
          <Link to={`/product/${product.slug}`}>
            <Card.Title title={product.name} className="product-name">
              {product.name}
            </Card.Title>
          </Link>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <Card.Text>
            <strong>{product.price} $</strong>
          </Card.Text>
          {product.countInStock === 0 ? (
            <Button disabled variant="danger" className="dis">
              Out of Stock
            </Button>
          ) : (
            <Button onClick={addToCartHandler}>Add to cart</Button>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default MainScreenComponents;
