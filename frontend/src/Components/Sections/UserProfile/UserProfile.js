import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store/Store";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ErrorCatch from "../../../ErrorCatch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
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
export default function UserProfile() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const [name, setName] = useState(userInfo?.name ?? "");
  const [email, setEmail] = useState(userInfo?.email ?? "");

  const [password, setPassword] = useState("");
  const [image, setImage] = useState(
    localStorage.getItem("image") || userInfo?.image
  );
  const [confirmPassword, setConfirmPassword] = useState("");
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
  const submitHandler = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      "/api/users/profile",
      {
        name,
        email,
        image,
        password,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: "UPDATE_SUCCESS" });
    ctxDispatch({ type: "USER_SIGNIN", payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
    toast.success("User updated successfully");
    try {
    } catch (error) {
      ctxDispatch({ type: "FETCH_FAIL" });
      toast.error(ErrorCatch(error));
    }
  };
  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
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
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Form.Group className="mt-3" controlId="image">
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
        </Form.Group>
        <Button type="submit">Update</Button>
      </Form>
    </div>
  );
}
