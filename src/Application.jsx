import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Navbar, Table, Form, Row, Col } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Cookies from "universal-cookie";
import AppForm from "./AppForm";
import { FaCircle } from "react-icons/fa";
import Resume from "./Resume";

export default function Application(props) {
  const cookies = new Cookies();
  const token = cookies.cookies.TOKEN;

  const [add, setAdd] = useState(0);
  const [data, setData] = useState([]);
  const email = sessionStorage.getItem("email");
  const [showForm, setShow] = useState(false);
  const [updatedStatus, setNewStatus] = useState("");

  const [idupdateStatus, setIdStatus] = useState("");

  const displayStatus = (status) => {
    let color = "";
    switch (status) {
      case "Pending":
        color = "yellow";
        break;
      case "Shortlisted":
        color = "green";
        break;
      case "Rejected":
        color = "red";
        break;

      default:
        color = "yellow";
    }

    return (
      <>
        <td className=" align-items-center">
          <FaCircle color={color} className="mx-2" />
          {status}
        </td>
      </>
    );
  };

  const removeApplication = (id) => {
    console.log(id);
    const config = {
      method: "patch",
      url: "http://localhost:8257/user/app/rem",
      data: {
        appId: id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then((response) => {
        console.log(response.data);
        setAdd((prev) => prev - 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }).slice(0, 3);
    const year = date.getFullYear().toString().slice(-2);
    const suffix =
      day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
    return `${day}${suffix} ${month} '${year}`;
  };

  const displayApplications = () => {
    return (
      <>
        {/* <ResumeForm/> */}
        <Table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Role</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.toReversed().map((app) => {
              return (
                <tr key={app.appId}>
                  <td>{app.company}</td>
                  <td>{app.jobRole}</td>
                  <td>{app.platform}</td>

                  <td>
                    {app.appId === idupdateStatus ? (
                      <Form.Select
                        name="status"
                        value={updatedStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Pending (Referral)">
                          Pending (Referral)
                        </option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </Form.Select>
                    ) : (
                      displayStatus(app.status)
                    )}
                  </td>
                  <td>{formatDate(app.dateApplied)}</td>
                  <td>
                    <Button
                      style={{
                        backgroundColor: "transparent",
                        color: "red",
                        border: "none",
                        fontSize: "25px",
                        padding: "0px",
                      }}
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        confirmDelete(app.appId);
                      }}
                    >
                      ×
                    </Button>
                  </td>
                  <td>
                    {app.appId === idupdateStatus ? (
                      <Button
                        variant="success"
                        onClick={() => {
                          const config = {
                            method: "patch",
                            url: "http://localhost:8257/user/app/status",
                            data: {
                              appId: app.appId,
                              status: updatedStatus,
                            },
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          };
                          console.log(updatedStatus);

                          if (updatedStatus.length > 0) {
                            axios(config)
                              .then((response) => {
                                console.log(response.data);
                                setAdd((prev) => prev - 1);
                              })
                              .catch((error) => {
                                console.error(error);
                              });
                          }
                          setNewStatus("");
                          setIdStatus("");
                        }}
                      >
                        ok
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setIdStatus(app.appId);
                        }}
                      >
                        edit
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  };

  const confirmDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete this file?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                console.log(id);

                removeApplication(id);
                onClose();
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      },
    });
  };

  useEffect(() => {
    const url = `http://localhost:8257/user/app/get`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(url, config)
      .then((res) => {
        setData(res.data.applications);
        console.log(res.data.applications);
      })
      .catch((error) => console.log(error));
  }, [add, email]);

  return (
    <>
      {/* <Welcome name={props.name}/> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="">Application</h3>
        {showForm ? (
          <Button
            className="rounded-circle"
            variant="danger"
            onClick={() => {
              setShow(false);
            }}
          >
            ×
          </Button>
        ) : (
          <Button
            className="rounded-circle"
            onClick={() => {
              setShow(true);
            }}
          >
            +
          </Button>
        )}
      </div>

      {showForm && <AppForm setAdd={setAdd} setShow={setShow} />}
      {displayApplications()}
      <Resume/>
    </>
  );
}
