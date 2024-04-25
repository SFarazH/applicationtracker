import React, { useEffect, useState } from "react";


import { Button, Col, Row, Container } from "react-bootstrap";
import Application from "./Application";
import Notes from "./Notes";
import Welcome from "./Welcome";

export default function Dashboard() {
  const email = sessionStorage.getItem("email");
  const name = sessionStorage.getItem("name");
  return (
    <div className="Dashboard">
      <Container id="welcome" fluid>
        <Container><Welcome name={name}></Welcome></Container>
      </Container>
      <Container className="min-vh-100" fluid>
        <Row id="appRow">
          <Col lg={{ span: 8 }} className="min-vh-100 p-4">
            <Application name={name} />
          </Col>
          <Col id="notesBg" lg={{ span: 4 }}>
            <Col className="d-flex justify-content-center mx-auto pt-4" lg={9}>
              <Notes />
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
