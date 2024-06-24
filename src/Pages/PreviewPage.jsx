import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const previewImage = location.state?.previewImage;
  const docName = location.state?.docName;

  const handleDownload = () => {
    if (previewImage) {
      const link = document.createElement("a");
      link.href = previewImage;
      link.download = "certificate.jpg";
      link.click();
    }
  };

  return (
    <div style={{ textAlign: "center" }} className="p-3">
      <h4 className="mb-2 fw-semibold h4 mb-3">Certificate of {docName}</h4>

      <Row className="align-items-center">
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center mb-3 mb-md-0"
        >
          <img
            src={previewImage}
            alt="Certificate Preview"
            style={{ maxWidth: "100%" }}
          />
        </Col>
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-between align-items-center"
        >
          <Button
            variant="outline-success"
            onClick={handleDownload}
            className="w-100 me-1"
          >
            Download Image
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/")}
            className="w-100 ms-1"
          >
            Back To Home
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PreviewPage;
