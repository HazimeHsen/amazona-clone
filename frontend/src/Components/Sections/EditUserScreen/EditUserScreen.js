import React, { useEffect, useReducer, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ErrorCatch from "../../../ErrorCatch";
import { toast } from "react-toastify";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_SUCCESS":
      return { ...state, loading: false };
    case "UPDATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default function EditUserScreen() {
  const navigate = useNavigate();
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    user: {},
    error: "",
  });
  const params = useParams();
  const { id: userId } = params;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/${userId}`);
        setName(data.name);
        setEmail(data.email);
        setAdmin(data.isAdmin);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
      }
    };
    fetchData();
  }, [userId]);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [admin, setAdmin] = useState(user.isAdmin);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    await axios.put(`/api/users/update/${userId}`, {
      name,
      email,
      admin,
    });
    dispatch({ type: "UPDATE_SUCCESS" });
    toast.success("User updated successfully");
    navigate("/admin/userlist");
    try {
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(ErrorCatch(error));
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Edit User {userId}</title>
      </Helmet>
      <h1>Edit User {userId}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Check
          onChange={() => setAdmin(!admin)}
          type="checkbox"
          id="Admin"
          label="Admin"
          value="Admin"
        />
        <Button className="mt-3" type="submit">
          Update
        </Button>
      </Form>
    </Container>
  );
}
