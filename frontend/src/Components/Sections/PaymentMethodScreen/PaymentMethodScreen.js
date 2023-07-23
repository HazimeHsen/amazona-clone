import React, { useContext, useEffect, useState } from "react";
import CheckOutSteps from "../../CheckOutSteps/CheckOutSteps";
import { Helmet } from "react-helmet-async";
import { Button, Container, Form } from "react-bootstrap";
import { Store } from "../../Store/Store";
import { useNavigate } from "react-router-dom";
import "./PaymentMethodScreen.css";
export const PaymentMethodScreen = () => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("PaymentMethod", paymentMethodName);
    navigate("/placeorder");
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);
  return (
    <div className="mt-3">
      <Container>
        <CheckOutSteps step1 step2 step3 />
        <div className="container small-container d-flex flex-column align-items-center">
          <Helmet>
            <title>Payment Method</title>
          </Helmet>
          <h1 className="my-3">Payment Method</h1>
          <Form onSubmit={submitHandler}>
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Button className="my-3" type="submit">
              Continue
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};
