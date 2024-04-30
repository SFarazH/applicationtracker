import { React, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Col, Container, Row } from "react-bootstrap";
import ResumeForm from "./ResumeForm";
import { FaFilePdf } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaCirclePlus, FaCircleXmark } from "react-icons/fa6";

export default function Resume() {
  const [resumeData, setResume] = useState([]);
  const [update, setUpdate] = useState(0);
  const [showForm, setShow] = useState(false);
  const cookies = new Cookies();
  const token = cookies.cookies.TOKEN;

  useEffect(() => {
    const url = `http://localhost:8257/user/resume/all`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(url, config)
      .then((res) => {
        console.log(res.data);
        setResume(res.data);
      })
      .catch((error) => console.log(error));
  }, [update]);

  //   console.log(resumeData)

  const displayResume = () => {
    return resumeData.map((resume) => {
      return (
        <>
          <Container>
            <Row className="my-4 align-items-center">
              <Col lg={3}>
                <p key={resume.app_rId} onClick={() => {}}>
                  {resume.role} Role
                </p>
              </Col>
              <Col lg={1}>
                <Button
                  variant="transparent"
                  className="p-0"
                  onClick={() => {
                    const config = {
                      method: "get",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      url: `http://localhost:8257/user/resume/resumes?rId=${resume.rId}`,
                      responseType: "blob",
                    };
                    axios(config)
                      .then((res) => {
                        const blobUrl = window.URL.createObjectURL(
                          new Blob([res.data], { type: "application/pdf" })
                        );
                        // Open the blob URL in a new tab
                        window.open(blobUrl, "_blank");
                      })
                      .catch((error) => console.log(error));
                  }}
                >
                  <FaFilePdf fontSize="3em" />
                </Button>
              </Col>
              <Col lg={1}>
                {" "}
                <Button
                  variant="transparent"
                  onClick={() => {
                    const config = {
                      method: "patch",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      url: `http://localhost:8257/user/resume/rem`,
                      data: {
                        rId: resume.rId,
                        app_rId: resume.app_rId,
                      },
                    };
                    axios(config)
                      .then((res) => {
                        console.log("Resume removed");
                        setUpdate((prev) => prev - 1);
                      })
                      .catch((error) => console.log(error));
                  }}
                >
                  <ImCross color="red" fontSize="1.7em" />
                </Button>
              </Col>
            </Row>
          </Container>
        </>
      );
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="">Resumes</h3>
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
      {showForm && <ResumeForm setUpdate={setUpdate} setShow={setShow} />}
      {displayResume()}
    </>
  );
}
