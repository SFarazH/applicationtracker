import { React, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const configuration = {
      method: "post",
      url: "http://localhost:8257/auth/register",
      data: {
        email,
        password,
        name,
      },
    };
    axios(configuration)
      .then((result) => {
        setRegister(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <h2>Register</h2>
      <Form onSubmit={(e) => handleSubmit(e)}>
        {/* email */}

        <Form.Group controlId="formBasicText">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            value={name}
            placeholder="Enter Name"
          />
        </Form.Group>

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
      {register && <h5 className="text-success">Successfully Registered</h5>}
      <Link to="/">
        <Button variant="primary" type="button">
          Login
        </Button>
      </Link>
    </>
  );
}
