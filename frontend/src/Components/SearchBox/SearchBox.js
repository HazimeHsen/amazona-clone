import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import "./SearchBox.css";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search?query=${query}` : "/search");
  };
  return (
    <Form className="" onSubmit={submitHandler}>
      <Form.Group className="d-flex">
        <Form.Control
          className="search-btn"
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search products"
          aria-label="Search Products"
          aria-describedby="button-search"
        />

        <Button
          className="btn-to-search"
          type="submit"
          variant="outline-primary"
          id="button-search">
          <GoSearch />
        </Button>
      </Form.Group>
    </Form>
  );
}
