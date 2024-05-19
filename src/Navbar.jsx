import React, { useEffect, useState, useMemo } from "react";
import Cookies from "universal-cookie";
import { Container, DropdownItem, Navbar } from "react-bootstrap";
import axios from "axios";
import { minidenticon } from "minidenticons";
import Dropdown from "react-bootstrap/Dropdown";

export default function Nav() {
  const cookies = new Cookies();
  const token = cookies.cookies.TOKEN;
  // const email = sessionStorage.getItem("email");
  const [isLogged, setLogged] = useState(cookies.cookies.TOKEN);
  const [name, setName] = useState("");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    isLogged &&
      axios
        .get(
          "https://e5z5x2yptp4auqanzhsyyxrqpu0qdfcy.lambda-url.ap-south-1.on.aws/user/profile",
          config
        )
        .then((res) => setName(res.data));
    if (token) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, []);

  useEffect(() => {
    const token = cookies.cookies.TOKEN;
    if (token) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, []);

  const MinidenticonImg = ({ username, saturation, lightness, ...props }) => {
    const svgURI = useMemo(
      () =>
        "data:image/svg+xml;utf8," +
        encodeURIComponent(minidenticon(username, saturation, lightness)),
      [username, saturation, lightness]
    );
    return <img src={svgURI} alt={username} {...props} />;
  };

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
          {isLogged && (
            <>
              <h3 className="navbarHeader d-none d-lg-block">
                Hello {name}! <span className="waving-hand">👋</span>
              </h3>

              <Dropdown>
                <Dropdown.Toggle
                  variant="transparent"
                  id="dropdown-basic"
                  className="p-0"
                  style={{ border: "none" }}
                >
                  <MinidenticonImg
                    username={name}
                    // username='prashant'
                    saturation="90"
                    width="75"
                    height="75"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <DropdownItem width="auto" onClick={logOut}>
                    logout
                  </DropdownItem>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Container>
      </Navbar>
      <div className="navbar my-0 py-0">
        <Container>
          {isLogged && (
            <>
              <h4 className="text-white d-lg-none d-block">
                Hello {name}! <span className="waving-hand">👋</span>
              </h4>
            </>
          )}
        </Container>
      </div>
    </>
  );
}
