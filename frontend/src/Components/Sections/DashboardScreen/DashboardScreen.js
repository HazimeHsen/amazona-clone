import { useContext, useEffect, useReducer } from "react";
import { Store } from "../../Store/Store";
import axios from "axios";
import ErrorCatch from "../../../ErrorCatch";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import { Card, Col, Container, Row } from "react-bootstrap";
import Chart from "react-google-charts";
import { Helmet } from "react-helmet-async";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: false,
    summary: null,
    error: "",
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/orders/summary", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: ErrorCatch(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <Container>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1 className="my-3">Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{summary ? summary.users.length : 0}</Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{summary ? summary.orders.length : 0}</Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {summary
                      ? Math.floor(
                          summary.orders.reduce((a, c) => a + c.totalPrice, 0) *
                            100
                        ) / 100
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3 ">
            <h2>Sales</h2>
            {summary ? (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ["Date", "Sales"],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              />
            ) : (
              <MessageBox>No Sales</MessageBox>
            )}
          </div>
          <div className="my-3">
            <h2>Categories</h2>
            {summary ? (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ["Category", "Products"],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              />
            ) : (
              <MessageBox>No Category</MessageBox>
            )}
          </div>
        </>
      )}
    </Container>
  );
}
