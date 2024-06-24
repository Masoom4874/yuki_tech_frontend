import React, { useState } from "react";
import homePageImg from "../assets/homePageImg.jpg";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [empCode, setEmpCode] = useState("");

  const handleCheckEmp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/yuki/check-emp",
        { empCode }
      );
      if (response.data.status) {
        navigate("/profile", { state: { empData: response.data.data } });
      } else {
        alert("Employee not found. Please check the Employee Code.");
      }
    } catch (error) {
      console.error("Error checking employee:", error);
      alert("An error occurred while checking the employee.");
    }
  };

  return (
    <Row>
      <Col md={12}>
        <Row className="justify-content-between">
          <Col xs={12} md={6} className="mb-3">
            <img
              src={homePageImg}
              alt="Home Page"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Col>
          <Col xs={12} md={6} className="mb-3">
            <Row className="align-items-end">
              <Col xs={12} md={12} lg={6} className="mb-3">
                <h2 className="mb-3 fs-2 fw-semibold">DOCTOR'S Day</h2>
                <h4 className="mb-2 fw-semibold">Employee Code</h4>
                <Form.Control
                  className="mb-2"
                  name="empCode"
                  value={empCode}
                  onChange={(e) => setEmpCode(e.target.value)}
                />
                <Col>
                  <span>Enter Employee Code to Proceed</span>
                </Col>
                <Col className="float-end">
                  <Button variant="outline-success" onClick={handleCheckEmp}>
                    Check Employee
                  </Button>
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default HomePage;
