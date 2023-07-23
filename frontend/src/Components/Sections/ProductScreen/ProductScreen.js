import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  Row,
  Toast,
} from "react-bootstrap";
import "./ProductScreen.css";
import Rating from "../../Rating/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import ErrorCatch from "../../../ErrorCatch";
import { Store } from "../../Store/Store";
import { toast } from "react-toastify";
import StarsComponent from "./StarsComponent/StarsComponent";
import ImageSlider from "../../Slider/Slider";

const initialValue = {
  product: [],
  loading: false,
  error: "",
  review: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
const ProductScreen = () => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [haveReview, setHaveReview] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product }, dispatch] = useReducer(
    reducer,
    initialValue
  );
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const userId = userInfo ? userInfo._id : null;
  useEffect(() => {
    const response = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.post(`/api/products/slug/${slug}`, {
          userId,
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data.product });
        console.log(data.haveReview);
        setHaveReview(data.haveReview);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
      }
    };
    response();
  }, [slug, userId, userInfo]);
console.log(stars);
const addToCartHandler = async () => {
  const existItem = cart.cartItems.find((x) => x._id === product._id);
  const quantity = existItem ? existItem.quantity + 1 : 1;

  const { data } = await axios.get(`/api/products/${product._id}`);
  if (data.countInStock < quantity) {
    window.alert("no items");
    return;
  }
  ctxDispatch({ type: "ADD_ITEM", payload: { ...product, quantity } });
  navigate("/cart");
};

const reviewHandler = async (e) => {
  e.preventDefault();
  if (!stars) {
    toast.error("Enter the stars");
    return;
  }
  if (!comment) {
    toast.error("Enter comment");
    return;
  }
  dispatch({ type: "FETCH_REQUEST" });
  try {
    const { data } = await axios.put(
      `/api/products/review/${product._id}`,
      {
        stars,
        comment,
      },
      { headers: { authorization: `Bearer ${userInfo.token}` } }
    );
    setComment("");
    setStars(0);
    dispatch({ type: "FETCH_SUCCESS", payload: data });
    toast.success("review success");
  } catch (error) {
    dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
    toast.success(ErrorCatch(error));
  }
};
function getTimeElapsedString(date) {
  const now = new Date();
  const elapsedMilliseconds = now - date;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (elapsedMilliseconds < minute) {
    return "just now";
  } else if (elapsedMilliseconds < hour) {
    const minutes = Math.floor(elapsedMilliseconds / minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (elapsedMilliseconds < day) {
    const hours = Math.floor(elapsedMilliseconds / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (elapsedMilliseconds < week) {
    const days = Math.floor(elapsedMilliseconds / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (elapsedMilliseconds < month) {
    const weeks = Math.floor(elapsedMilliseconds / week);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (elapsedMilliseconds < year) {
    const months = Math.floor(elapsedMilliseconds / month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(elapsedMilliseconds / year);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}
console.log(product);

return loading ? (
  <LoadingBox />
) : error ? (
  <MessageBox variant="danger">{error}</MessageBox>
) : (
  <Container>
    <Row className="mt-5">
      <Col className="d-flex justify-content-center" md={6}>
        {product == false ? (
          "no"
        ) : (
          <div className="larg-img">
            <ImageSlider images={product.image} />
          </div>
        )}
      </Col>
      <Col md={3}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <h1 title={product.name} className="overflow">
              {product.name}
            </h1>
          </ListGroup.Item>
          <ListGroup.Item>
            <Rating rating={product.rating} numReviews={product.numReviews} />
          </ListGroup.Item>
          <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
          <ListGroup.Item>
            Description:
            <p>{product.description}</p>
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>${product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg="success">In Stock</Badge>
                    ) : (
                      <Badge bg="danger">Unavailable</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className="w-100"
                    variant="primary">
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        {userInfo ? (
          !haveReview || userInfo.isAdmin ? (
            <>
              <h1 className="my-3">Write a customer review:</h1>
              <h3 className="my-3"> Rating:</h3>

              <Row>
                <Col md={5}>
                  <StarsComponent
                    stars={stars}
                    setStars={setStars}
                    click={true}
                  />
                </Col>
              </Row>
              <Form>
                <h1 className="my-3">Comment:</h1>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Comments"
                  className="mb-3">
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </FloatingLabel>
              </Form>
              <Button onClick={reviewHandler} type="submit" className="my-3">
                Review
              </Button>
            </>
          ) : (
            <MessageBox>Already Review</MessageBox>
          )
        ) : (
          <MessageBox>You should signin</MessageBox>
        )}
      </Col>
      <Col md={6}>
        <h1 className="my-3">Reviews:</h1>
        {product.review ? (
          product.review.map((rev) => (
            <Toast className="w-100">
              <Toast.Header closeButton={false}>
                <img src="" className="rounded me-2" alt="" />
                <strong className="d-flex me-auto">
                  {rev.name}
                  <span className="mx-2">
                    <StarsComponent stars={rev.rating} click={false} />
                  </span>
                </strong>

                <small>{getTimeElapsedString(new Date(rev.createdAt))}</small>
              </Toast.Header>
              <Toast.Body>{rev.comment}</Toast.Body>
            </Toast>
          ))
        ) : (
          <MessageBox>No</MessageBox>
        )}
      </Col>
    </Row>
  </Container>
);
};

export default ProductScreen;
