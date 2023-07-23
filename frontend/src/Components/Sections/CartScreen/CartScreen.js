import React, { useContext } from "react";
import { Store } from "../../Store/Store";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import MessageBox from "../../MessageBox/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import "./CartScreen.css";
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
export const CartScreen = () => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();
  const updateCartHandler = (item, quantity) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity } });
    if (item.countInStock === quantity) {
      window.alert("no items");
      return;
    }
  };
  const removeItemHandler = (item) => {
    dispatch({ type: "REMOVE_ITEM", payload: item });
  };
  const checkOutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <Container>
        <h1 className="my-3">Shopping Cart</h1>
        <Row>
          <Col md={8}>
            {cartItems.length === 0 ? (
              <MessageBox>
                Cart is empty. <Link to="/">Go Shopping</Link>
              </MessageBox>
            ) : (
              <ListGroup>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          className=" img-fluid rounded img-thumbnail"
                        />{" "}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <Button
                          variant="ligth"
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}>
                          <HiOutlineMinusCircle />
                        </Button>{" "}
                        <span>{item.quantity}</span>{" "}
                        <Button
                          variant="ligth"
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          disabled={item.quantity === item.countInStock}>
                          <HiOutlinePlusCircle />
                        </Button>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                      <Col md={2}>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant="ligth">
                          <BsTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                      items) : $
                      {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      className="w-100"
                      type="button"
                      onClick={checkOutHandler}
                      disabled={cartItems.length === 0}>
                      Proceed to Checkout
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
