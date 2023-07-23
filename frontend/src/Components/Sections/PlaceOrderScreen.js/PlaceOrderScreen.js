import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import CheckOutSteps from "../../CheckOutSteps/CheckOutSteps";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../../Store/Store";
import { toast } from "react-toastify";
import ErrorCatch from "../../../ErrorCatch";
import axios from "axios";
import LoadingBox from "../../LoadingBox/LoadingBox";
const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const PlaceOrderScreen = () => {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100) / 100;

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(ErrorCatch(error));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);
  return (
    <div className="mt-3">
      <Container>
        {loading ? (
          <LoadingBox />
        ) : (
          <>
            <CheckOutSteps step1 step2 step3 step4 />
            <Helmet>
              <title>Place Order</title>
            </Helmet>
            <h1 className="my-3">Place Order</h1>
            <Row>
              <Col md={8}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>Shipping</Card.Title>
                    <Card.Text>
                      <strong>Name:</strong> {cart.shippingAddress.fullName}{" "}
                      <br />
                      <strong>Address:</strong> {cart.shippingAddress.address},
                      {cart.shippingAddress.city},
                      {cart.shippingAddress.postalCode},
                      {cart.shippingAddress.country}
                    </Card.Text>
                    <Link to="/shipping">Edit</Link>
                  </Card.Body>
                </Card>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>Payment</Card.Title>
                    <Card.Text>
                      <strong>Name:</strong> {cart.paymentMethod}
                    </Card.Text>
                    <Link to="/payment">Edit</Link>
                  </Card.Body>
                </Card>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>Items</Card.Title>
                    <ListGroup variant="flush">
                      {cart.cartItems.map((item) => (
                        <ListGroup.Item key={item._id}>
                          <Row className="align-items-center">
                            <Col md={6}>
                              <img
                                src={item.image[0]}
                                alt={item.name}
                                className="img-fluid img-thumbnail rounded"
                              />{" "}
                              <Link to={`/product/${item.slug}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={3}>
                              <span>{item.quantity}</span>
                            </Col>
                            <Col md={3}>${item.price}</Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    <Link to="/payment">Edit</Link>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Order Summery</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>Items</Col>
                          <Col>${cart.itemsPrice.toFixed(2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Shipping</Col>
                          <Col>${cart.shippingPrice.toFixed(2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Tax</Col>
                          <Col>${cart.taxPrice.toFixed(2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>
                            <strong>Order Total</strong>
                          </Col>
                          <Col>
                            <strong>${cart.totalPrice.toFixed(2)}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Button
                          className="w-100"
                          type="button"
                          onClick={placeOrderHandler}
                          disabled={cart.cartItems.length === 0}>
                          Place Order
                        </Button>
                        <br />
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};
