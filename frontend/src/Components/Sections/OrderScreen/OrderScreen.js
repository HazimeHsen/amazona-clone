import React, { useContext, useEffect, useReducer, useState } from "react";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import { Store } from "../../Store/Store";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ErrorCatch from "../../../ErrorCatch";
import { Helmet } from "react-helmet-async";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import "./OrderScreen.css";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export const OrderScreen = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  const [success, setSuccess] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
      }
    };
    if (!userInfo) {
      return navigate("/signin");
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [navigate, order, orderId, userInfo, success]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get("success");
    if (successParam === "true") {
      const fetchData = async () => {
        try {
          await axios.post(`/api/orders/success/${orderId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
        } catch (error) {
          toast.error(ErrorCatch(error));
        }
      };
      fetchData();
      setSuccess(true);
      setToastShown(true);
    }
    if (success && toastShown) {
      setToastShown(false);
      toast.success("Payment Success");
    }
  }, [orderId, success, userInfo]);
  const stripeHandler = async (e) => {
    try {
      const { data } = await axios.post(`/api/orders/stripe/${orderId}`, {
        order,
      });
      window.location.href = data.url;
    } catch (error) {
      toast.error(ErrorCatch(error));
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <Container>
        <h1 className="my-3">Order {orderId}</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address:</strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </Card.Text>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {order.paymentMethod}
                </Card.Text>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {order.orderItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="img-fluid img-thumbnail rounded"
                          />{" "}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>${item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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
                      <Col>${order.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Order Total</strong>
                      </Col>
                      <Col>
                        <strong>${order.totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {order.paymentMethod === "Stripe" ? (
                    <ListGroup.Item>
                      {order.isPaid ? (
                        <MessageBox variant="success">
                          Payment successful!
                        </MessageBox>
                      ) : (
                        <button
                          className="w-100 stripe-button-el"
                          type="button"
                          onClick={stripeHandler}>
                          Stripe
                        </button>
                      )}
                    </ListGroup.Item>
                  ) : (
                    <ListGroup.Item>
                      <button class="w-100 stripe-button-el" type="button">
                        <span>Pay with PayPal</span>
                      </button>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
