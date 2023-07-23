import { Badge, Button, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Navbar.css";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store/Store";
import SearchBox from "../SearchBox/SearchBox";
import { GiHamburgerMenu } from "react-icons/gi";
function NavBar({ sideBar, setSideBar }) {
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const title = userInfo ? (
    <span>
      <img
        className="me-1 profile-image"
        src={userInfo.image}
        alt={userInfo.name}
      />{" "}
      <span>{userInfo.name}</span>
    </span>
  ) : (
    ""
  );
  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shipping");
    localStorage.removeItem("PaymentMethod");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);
  return (
    <Navbar
      key={"md"}
      bg="dark"
      expand={"md"}
      variant="dark"
      className={`Nav navbar-box-shadow nav-fixed ${
        visible ? "navbar-show" : "navbar-hide"
      } ${sideBar ? "nav-reduce-width" : ""}`}>
      <Container className="w-100">
        <Button
          className="nav-side-bar-btn"
          variant="dark"
          onClick={() => setSideBar(!sideBar)}>
          <GiHamburgerMenu />
        </Button>
        <LinkContainer to="/">
          <Navbar.Brand>Shop</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <SearchBox />
          <Nav className="justify-content-end flex-grow-1 pe-3 align-items-center">
            <Link className="nav-link me-3" to="/cart">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>

            {userInfo ? (
              <>
                <NavDropdown title={title} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className="dropdown-item"
                    to="/signin"
                    onClick={signoutHandler}>
                    Sign Out
                  </Link>
                </NavDropdown>
              </>
            ) : (
              <Link className="nav-link" to="/signin">
                Sign In
              </Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="Admin" id="admin-nav-dropdown">
                <LinkContainer to="/admin/dashboard">
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/productlist">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orderlist">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
