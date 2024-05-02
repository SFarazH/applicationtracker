import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
// import { v4 } from "uuid";
import axios from "axios";
import Cookies from "universal-cookie";

export default function AppForm({ setAdd, setShow }) {
  const cookies = new Cookies();
  const token = cookies.cookies.TOKEN;

  const email = sessionStorage.getItem("email");
  const [formData, setFormData] = useState({
    company: "",
    jobRole: "",
    platform: "",
    dateApplied: "",
    status: "",
  });

  const addApplication = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "post",
      url: "https://e5z5x2yptp4auqanzhsyyxrqpu0qdfcy.lambda-url.ap-south-1.on.aws/user/app/add",
      data: formData,
    };
    console.log(formData);
    axios(config)
      .then((response) => {
        console.log(response.data);
        setAdd((prev) => prev + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addApplication(email);
    console.log(formData);
    setShow(false);
    setFormData({
      company: "",
      jobRole: "",
      platform: "",
      // dateApplied: "",
    });
  };

  const handleTodayButtonClick = () => {
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10); // Get date in YYYY-MM-DD format
    setFormData({
      ...formData,
      dateApplied: formattedDate,
    });
  };

  return (
    <Container className="px-4 pb-4">
      <div id="formCard" className="card">
        <Form onSubmit={handleSubmit}>
          <Form.Label className="">
            <h5>Add Application</h5>
          </Form.Label>
          <Form.Group controlId="companyName">
            <Row className="mb-3">
              <Col lg={3}>
                <Form.Label>Company Name</Form.Label>
              </Col>
              <Col lg={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter company name"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="dateApplied">
            <Row className="my-3">
              <Col lg={3}>
                <Form.Label>Date Applied</Form.Label>
              </Col>
              <Col lg={9}>
                <div className="input-group">
                  <Form.Control
                    type="date"
                    name="dateApplied"
                    value={formData.dateApplied}
                    onChange={handleChange}
                  />
                  <Button id="todayBtn" onClick={handleTodayButtonClick}>
                    Today
                  </Button>
                </div>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="jobRole">
            <Row className="my-3">
              <Col lg={3}>
                <Form.Label>Job Role</Form.Label>
              </Col>
              <Col lg={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter job role"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="status">
            <Row className="my-3">
              <Col lg={3}>
                <Form.Label>Status</Form.Label>
              </Col>
              <Col lg={9}>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Pending (Referral)">Pending (Referral)</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="platform">
            <Row className="my-3">
              <Col lg={3}>
                <Form.Label>Platform</Form.Label>
              </Col>
              <Col lg={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Form.Group>

          <Button id="addApp" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
}
