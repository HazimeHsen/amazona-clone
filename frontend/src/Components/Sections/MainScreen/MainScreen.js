import React, { useContext, useEffect } from "react";
import "./MainScreen.css";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import MainScreenComponents from "./MainScreenComponents/MainScreenComponents";
import { product } from "./GetData/GetData";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import ErrorCatch from "../../../ErrorCatch";

const MainScreen = () => {
  const { state, dispatch } = useContext(product);
  const { loading, error, products } = state;
  useEffect(() => {
    const response = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
      }
    };
    response();
  }, [dispatch]);
  return (
    <div className="">
      <Helmet>
        <title>Shop App</title>
      </Helmet>
      <Container>
        <h2 className="main-header"> Featured products</h2>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row className="products">
            {products.map((product) => (
              <Col
                key={product.slug}
                className="product"
                lg={3}
                md={4}
                sm={6}
                xs={12}>
                <MainScreenComponents product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MainScreen;
