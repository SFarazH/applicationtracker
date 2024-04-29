import { React, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button } from "react-bootstrap";
import ResumeForm from "./ResumeForm";

export default function Resume() {
  const [resumeData, setResume] = useState([]);
  const [update, setUpdate] = useState(0);
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
          <h6 key={resume.app_rId} onClick={() => {}}>
            {resume.role}
          </h6>

          <Button
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
            show
          </Button>

          <Button
            variant="danger"
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
            {" "}
            ×{" "}
          </Button>
        </>
      );
    });
  };

  return (
    <>
      <h4>resume</h4>
      {displayResume()}
      <ResumeForm setUpdate={setUpdate}/>
    </>
  );
}
