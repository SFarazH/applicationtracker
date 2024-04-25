import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Cookies from "universal-cookie";
import axios from "axios";
import {
  faArrowRightFromBracket,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function Welcome(props) {
  const cookies = new Cookies();
  const token = cookies.cookies.TOKEN;
  const [isLogged, setLogged] = useState(cookies.cookies.TOKEN);
  const [name, setName] = useState("");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    
    axios
      .get("http://localhost:8257/user/profile", config)
      .then((res) => setName(res.data));
    if (token) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, []);
  // logout
  const logOut = () => {
    // destroy the cookie
    cookies.remove("TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  };

  return (
    <>
      <Row>
        <Col>
          <h3 className="navbarHeader">
            Hello {name}! <span className="waving-hand">👋</span>
          </h3>
        </Col>
        {isLogged && (
          <Col xs="auto">
            <Button type="submit" variant="transparent" onClick={logOut}>
              <FontAwesomeIcon
                className="logoutBtn"
                icon={faArrowRightFromBracket}
              />
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
}