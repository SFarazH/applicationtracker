import { React, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
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
    const url = `https://e5z5x2yptp4auqanzhsyyxrqpu0qdfcy.lambda-url.ap-south-1.on.aws/user/resume/all`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(url, config)
      .then((res) => {
        // console.log(res.data);
        setResume(res.data);
      })
      .catch((error) => console.log(error));
  }, [update]);

  //   console.log(resumeData)

  const ResumeCard = (props) => {
    return (
      <Card bg="transparent" id="resumeCard">
        <Card.Body className="p-0">
          <Card.Title
            className="m-0 p-3 rounded-top text-white"
            id="resumeCardTitle"
          >
            {props.resume.role} Resume
          </Card.Title>
          <Card.Text
            id="cardBody"
            className="d-flex justify-content-between p-3 rounded-bottom"
          >
            <Button
              variant="transparent"
              className="p-0"
              onClick={() => {
                const config = {
                  method: "get",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  url: `https://application-api-6n5d.onrender.com/user/resume/resumes?rId=${props.resume.rId}`,
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
            <Button
              variant="transparent"
              onClick={() => {
                const config = {
                  method: "patch",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  url: `https://e5z5x2yptp4auqanzhsyyxrqpu0qdfcy.lambda-url.ap-south-1.on.aws/user/resume/rem`,
                  data: {
                    rId: props.resume.rId,
                    app_rId: props.resume.app_rId,
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
              <ImCross color="red" fontSize="1.3em" />
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  const displayResume = () => {
    return (
      <>
        <Container fluid>
          <Row>
            {resumeData.map((resume) => {
              return (
                <>
                  <Col lg={4} md={4} sm={4} className="my-2">
                    <ResumeCard resume={resume} />
                  </Col>
                </>
              );
            })}
          </Row>
        </Container>
      </>
    );
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
