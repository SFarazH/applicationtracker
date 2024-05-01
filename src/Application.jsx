import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Navbar,
  Table,
  Form,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Cookies from "universal-cookie";
import AppForm from "./AppForm";
import { ImCross } from "react-icons/im";
import { MdModeEdit } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaCirclePlus, FaCircleXmark } from "react-icons/fa6";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

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
        color = "gold";
        break;
      case "Shortlisted":
        color = "green";
        break;
      case "Interview":
        color = "green";
        break;
      case "Rejected":
        color = "red";
        break;

      default:
        color = "#F8E800";
    }

    return (
      <>
        <td className=" align-items-center">
          <RiCheckboxBlankCircleFill
            color={color}
            style={{ marginRight: "4px" }}
          />
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
    return `${day} ${month} `;
  };

  const displayApplications = () => {
    return (
      <>
        <Table striped bordered responsive="md" >
          <colgroup>
            <col style={{ width: "12%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "1%" }} />
            <col style={{ width: "1%" }} />
          </colgroup>
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
          <tbody >
            {data.toReversed().map((app) => {
              return (
                <tr  key={app.appId}>
                  <td className="px-3">{app.company}</td>
                  <td className="px-3">{app.jobRole}</td>
                  <td className="px-3">{app.platform}</td>

                  <td className="px-2">
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
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                      </Form.Select>
                    ) : (
                      displayStatus(app.status)
                    )}
                  </td>
                  <td className="px-3">{formatDate(app.dateApplied)}</td>
                  <td>
                    <Button
                      variant="transparent"
                      onClick={() => {
                        confirmDelete(app.appId);
                      }}
                    >
                      <ImCross color="red" size="1.4em" />
                    </Button>
                  </td>
                  <td>
                    {app.appId === idupdateStatus ? (
                      <Button
                        variant="transparent"
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
                        <TiTick size="1.7em" color="green" />
                      </Button>
                    ) : (
                      <Button
                        variant="transparent"
                        onClick={() => {
                          setIdStatus(app.appId);
                        }}
                      >
                        <MdModeEdit color="forestgreen" size="1.7em" />
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
      })
      .catch((error) => console.log(error));
  }, [add, email]);

  return (
    <>
      {/* <Welcome name={props.name}/> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="">Application</h3>
        {showForm ? (
          <FaCircleXmark
            onClick={() => {
              setShow(false);
            }}
            size="1.8em"
            cursor="pointer"
            color="#ED1B24"
          />
        ) : (
          <FaCirclePlus
            onClick={() => {
              setShow(true);
            }}
            size="1.8em"
            cursor="pointer"
            color="green"
          />
        )}
      </div>

      {showForm && <AppForm setAdd={setAdd} setShow={setShow} />}
      <div className="tableScroll">{displayApplications()}</div>
    </>
  );
}
