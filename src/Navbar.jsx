import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Button, Container, Navbar } from "react-bootstrap";

export default function Nav() {
  const cookies = new Cookies();
  const email = sessionStorage.getItem("email");
  const [isLogged, setLogged] = useState(cookies.cookies.TOKEN);

  useEffect(() => {
    const token = cookies.cookies.TOKEN;
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
      <Navbar className="navbar ">
        <Container>
          <div className="navbarHeader poppins-bold">Application Tracker</div>
        </Container>
      </Navbar>
    </>
  );
}
