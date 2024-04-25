import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Register from "./Register";
import Login from "./Login";

export default function Home() {
  return (
    <>
      <Container>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Login />
          </Col>
        </Row>
      </Container>
    </>
  );
}
