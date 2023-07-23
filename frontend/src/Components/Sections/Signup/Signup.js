import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "./Signup.css";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../../Store/Store";
import { toast } from "react-toastify";
import ErrorCatch from "../../../ErrorCatch";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consfirmPassword, setConsfirmPassword] = useState("");
  const [image, setImage] = useState("/image/no-image.jpg");

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  console.log(image);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== consfirmPassword) {
      toast.error("Password do not match");
      return;
    }
    try {
      const { data } = await axios.post("/api/users/signup", {
        name,
        email,
        image,
        password,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect);
    } catch (error) {
      toast.error(ErrorCatch(error));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData);
      dispatch({ type: "FETCH_SUCCESS" });

      toast.success("Image uploaded successfully");
      if (image) {
        setImage(`/image/${data.filename}`);
        localStorage.setItem("image", `/image/${data.filename}`);
      } else {
        setImage(`/image/${data.filename}`);
        localStorage.setItem("image", `/image/${data.filename}`);
      }
    } catch (err) {
      toast.error(ErrorCatch(err));
      dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(err) });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign UP</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            onChange={(e) => setConsfirmPassword(e.target.value)}
            required
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label className="custom-file-upload image-upload">
            <span className="me-2">Image File</span>
            <i className="fa fa-cloud-upload"></i>
            <input type="file" onChange={uploadFileHandler} />
          </Form.Label>
          <br />
          {image && (
            <img
              className="img-fluid img-thumbnail rounded me-2"
              src={image}
              alt={image}
            />
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <div className="mb-3">
          Already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
};

export default Signup;
