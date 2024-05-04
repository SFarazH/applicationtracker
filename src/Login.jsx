import { React, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLogin] = useState(false);

  const cookies = new Cookies();
  const [isLogged, setLogged] = useState(cookies.cookies.TOKEN);

  useEffect(() => {
    const token = cookies.cookies.TOKEN;
    if (token) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, []);
  {
    isLogged && (window.location.href = "/dashboard");
  }

  // console.log(cookies);
  const handleSubmit = (e) => {
    e.preventDefault();
    const configuration = {
      method: "post",
      url: "http://localhost:8257/auth/login",
      data: {
        email,
        password,
      },
    };
    axios(configuration)
      .then((result) => {
        // console.log(result);
        setLogin(true);
        cookies.set("TOKEN", result.data.token, {
          path: "/",
        });
        sessionStorage.setItem("name", result.data.name);
        sessionStorage.setItem("email", result.data.email);

        window.location.href = "/dashboard";
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      {/* <Nav/> */}
      <h2>Login</h2>
      <Form onSubmit={(e) => handleSubmit(e)}>
        {/* email */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            value={email}
            placeholder="Enter email"
          />
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            value={password}
            placeholder="Password"
          />
        </Form.Group>

        {/* submit button */}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {loggedIn && <h5 className="text-success">Logged in</h5>}

      <Link to="/register">
        <Button variant="primary" type="button">
          Register
        </Button>
      </Link>
    </>
  );
}
