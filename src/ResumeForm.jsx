import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import Cookies from "universal-cookie";

export default function ResumeForm(props) {
  const cookies = new Cookies();
  const token = cookies.cookies.TOKEN;
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Check if file size is less than 16MB
    if (selectedFile && selectedFile.size < 16777216) {
      setFile(selectedFile);
    } else {
      alert("Please select a file smaller than 16MB");
      e.target.value = null; // Reset the file input
    }
  };

  const addResume = (pdf, role) => {
    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("role", role);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "post",
      url: "http://localhost:8257/user/resume/add",
      data: formData,
    };
    console.log(formData);
    axios(config)
      .then((response) => {
        console.log(response.data);
        props.setUpdate((prev) => prev + 1);
        setRole("");
        setFile(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addResume(file, role);
    props.setShow(false);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={5}>
            <Form.Group controlId="formRole">
              <Row className="align-items-center">
                <Col lg={2}>
                  <Form.Label lg={4} className="m-0">
                    Role
                  </Form.Label>
                </Col>
                <Col lg={10}>
                  <Form.Control
                    type="text"
                    placeholder="Enter role"
                    value={role}
                    onChange={handleRoleChange}
                  />
                </Col>
              </Row>
            </Form.Group>
          </Col>
          <Col lg={5}>
            <Form.Group controlId="formFile">
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
