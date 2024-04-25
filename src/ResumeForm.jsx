import React, { useState } from "react";
import axios from "axios";

const ResumeForm = () => {
  const [pdfData, setPdfData] = useState(null);
  const [error, setError] = useState(null);

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8257/download/${id}`, {
        responseType: "blob",
      });
      //   console.log(response.data);

      // Create a blob URL for the downloaded file
      // const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url, "_blank");
      // Create a temporary URL for the blob object

      //   window.open(pdfUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("Error downloading PDF.");
    }
  };
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      await axios.post("http://localhost:8257/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset the file input
      setFile(null);
      alert("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div>
      <h2>Upload PDF File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      <div>
        <h2>Download PDF</h2>
        <button onClick={() => handleDownload("662a9e31dcd1dece2042939f")}>
          Download PDF
        </button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default ResumeForm;
