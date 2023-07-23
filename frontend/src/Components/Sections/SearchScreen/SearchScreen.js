import axios from "axios";
import React, { useReducer, useEffect } from "react";
import { toast } from "react-toastify";
import ErrorCatch from "../../../ErrorCatch";
import { Link, useLocation } from "react-router-dom";
import MainScreenComponents from "../MainScreen/MainScreenComponents/MainScreenComponents";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "REQUEST_PRODUCT":
      return { loading: true };
    case "SUCCESS_PRODUCT":
      return { loading: false, products: action.payload };
    case "SUCCESS_CATEGORY":
      return { loading: false, catgorys: action.payload };
    case "FAILD_PRODUCT":
      return { loading: false };
    default:
      return state;
  }
};

export default function SearchScreen() {
  const [{ loading, products, catgorys }, dispatch] = useReducer(reducer, {
    loading: true,
    products: null,
    catgorys: null,
  });
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query");
  const category = new URLSearchParams(search).get("category");
  const price = new URLSearchParams(search).get("price");
  const rating = new URLSearchParams(search).get("rating");
  const order = new URLSearchParams(search).get("order");
  console.log(category);
  console.log(price);
  console.log(price);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch({ type: "REQUEST_PRODUCT" });
        const { data } = await axios.get(
          `/api/products/search?&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        console.log(data);
        dispatch({ type: "SUCCESS_PRODUCT", payload: data.products });
      } catch (error) {
        dispatch({ type: "FAILD_PRODUCT" });
        toast.error(ErrorCatch(error));
      }
    };

    fetchProducts();
  }, [category, order, price, query, rating]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        dispatch({ type: "SUCCESS_CATEGORY", payload: data });
      } catch (err) {
        toast.error(ErrorCatch(err));
      }
    };
    fetchCategories();
  }, [category, order, price, query, rating]);
  return (
    <div className="mt-5">
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Container>
        <Row className="justify-content-center">
          <Col md={3}>
            <h2 className="mb-3">Department</h2>
            <ul>
              <li>
                <Link
                  to={`/search?category=all&query=all&price=50-100&rating=all&order=highest`}>
                  Any
                </Link>
              </li>
              {catgorys
                ? catgorys.map((c) => (
                    <li>
                      <Link
                        to={`/search?category=${c}&query=all&price=all&rating=all&order=highest`}>
                        {c}
                      </Link>
                    </li>
                  ))
                : ""}
            </ul>
          </Col>
          {products ? (
            products.map((product) => (
              <Col className="product" md={3}>
                <MainScreenComponents product={product} />
              </Col>
            ))
          ) : (
            <span>There is no products</span>
          )}
        </Row>
      </Container>
    </div>
  );
}
