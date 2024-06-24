import React, { useState } from "react";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import homePageImg from "../assets/homePageImg.jpg";
import templateImg from "../assets/templateImg.jpg";
import axios from "axios";

const Profile = () => {
  const location = useLocation();
  const { empData } = location.state;

  const [formData, setFormData] = useState({
    docName: "",
    contNo: "",
  });

  const [docImg, setDocImg] = useState(null);
  const [docImgUrl, setDocImgUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [croppedImg, setCroppedImg] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleStampChange = (e) => {
    const file = e.target.files[0];
    setDocImg(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setDocImgUrl(objectUrl);
      setModalOpen(true); // Open modal when image is selected
      // Clean up the object URL when the component unmounts or when a new file is selected
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setDocImgUrl(null);
    }
  };

  const updateAvatar = (croppedImageUrl) => {
    setDocImgUrl(croppedImageUrl); // Update preview immediately
    setCroppedImg(croppedImageUrl); // Save cropped image data URL
    setModalOpen(false); // Close modal after cropping
  };

  const handleCreateCertificate = () => {
    console.log(empData);
    const { docName, contNo } = formData;

    if (!docName) {
      alert("Please Enter Name");
      return;
    }
    if (!contNo) {
      alert("Please Enter Contact Number");
      return;
    }
    if (!croppedImg) {
      alert("Please Upload Image");
      return;
    }

    // Create a new image
    const templateImage = new Image();
    templateImage.src = templateImg;

    // Load the template image to get its dimensions
    templateImage.onload = () => {
      const imgWidth = 1748; // Width of A5 in pixels at 300 DPI
      const imgHeight = 2480; // Height of A5 in pixels at 300 DPI

      // Create a canvas element with the new resolution
      const canvas = document.createElement("canvas");
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      const ctx = canvas.getContext("2d");

      // Draw the template image
      ctx.drawImage(templateImage, 0, 0, imgWidth, imgHeight);

      // Set font size and add text for name
      ctx.font = "64px Arial"; // Set font to Arial with size 64px
      ctx.fillStyle = "#0F86BE";
      const fullName = `Dr. ${docName}`;
      const textWidth = ctx.measureText(fullName).width;
      const textX = (imgWidth - textWidth) / 2;
      ctx.fillText(fullName, textX, 1810);

      // Function to render image in a circular shape
      const renderCircularImage = (img, x, y, diameter) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          x + diameter / 2,
          y + diameter / 2,
          diameter / 2,
          0,
          Math.PI * 2,
          true
        );
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, diameter, diameter);
        ctx.restore();
      };

      // Add cropped image
      const img = new Image();
      img.src = croppedImg;
      img.onload = async () => {
        const imgSize = 910; // Diameter of the circular image
        const x = imgWidth / 2 - imgSize / 2; // Centered horizontally
        const y = imgHeight / 2 - imgSize / 2 - 168; // Adjust as needed

        // Render circular image
        renderCircularImage(img, x, y, imgSize);

        // Convert canvas to JPEG data URL
        const jpegUrl = canvas.toDataURL("image/jpeg", 1.0); // Increased image quality

        // Set the preview image and navigate to the preview page
        setPreviewImage(jpegUrl);

        // Prepare form data for the API call
        const formData = new FormData();
        formData.append("id", empData._id);
        formData.append("docName", docName);
        formData.append("contNo", contNo);
        formData.append("cert", jpegUrl);

        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/yuki/create-cert",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.status) {
            navigate("/preview", {
              state: { previewImage: jpegUrl, docName: docName },
            });
          } else {
            alert("Error creating certificate. Please try again.");
          }
        } catch (error) {
          console.error("Error creating certificate:", error);
          alert("An error occurred while creating the certificate.");
        }
      };
    };
  };

  return (
    <>
      <Row>
        <Col md={12}>
          <Row className="justify-content-between">
            <Col xs={12} md={6} className="mb-3">
              <img
                src={homePageImg}
                alt="Home Page"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <h2 className="mb-3 fs-2 fw-semibold">DOCTOR'S Day</h2>

              <Row className="align-items-end">
                <Col xs={12} md={12} lg={6} className="mb-3">
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="fw-semibold" id="basic-addon1">
                      Employee Code
                    </InputGroup.Text>
                    <Form.Control
                      disabled
                      placeholder={empData.empCode}
                      aria-label="empCode"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </Col>
                <Col xs={12} md={12} lg={6} className="mb-3">
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="fw-semibold" id="basic-addon1">
                      Name
                    </InputGroup.Text>
                    <Form.Control
                      disabled
                      placeholder={empData.compName}
                      aria-label="compName"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </Col>
                <Col xs={12} md={12} lg={6} className="mb-3">
                  <h4 className="mb-2 fw-semibold">Doctor Name</h4>
                  <Form.Control
                    name="docName"
                    placeholder="Enter Doctor Name"
                    value={formData.docName}
                    onChange={handleChange}
                  />
                </Col>
                <Col xs={12} md={12} lg={6} className="mb-3">
                  <h4 className="mb-2 fw-semibold">Contact Number</h4>
                  <Form.Control
                    name="contNo"
                    placeholder="Enter Contact No."
                    value={formData.contNo}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Button
                onClick={() => setModalOpen(true)}
                variant="outline-secondary"
                className="me-3"
              >
                Choose Image
              </Button>
              <Button
                variant="outline-success"
                onClick={handleCreateCertificate}
              >
                Save & Next
              </Button>

              {docImgUrl && (
                <>
                  <h4 className="my -2">Image Preview</h4>
                  <Row className="my-3 d-flex justify-content-center align-items-center text-center">
                    <Col xs={12}>
                      <img
                        src={docImgUrl}
                        alt="Stamp Preview"
                        style={{
                          maxWidth: "200px",
                          height: "auto",
                          objectFit: "cover", // Ensures the image covers the entire circle without stretching
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Col>

        {modalOpen && (
          <Modal
            closeModal={() => setModalOpen(false)}
            updateAvatar={updateAvatar}
            src={docImgUrl}
          />
        )}
      </Row>
    </>
  );
};

export default Profile;

{
  /* <>
<Row>
  <Col md={12}>
    <Row className="justify-content-between">
      <Col xs={12} md={6} className="mb-3">
        <img
          src={homePageImg}
          alt="Home Page"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Col>
      <Col xs={12} md={6} className="mb-3">
        <Row className="align-items-end">
          <Col xs={12} md={12} lg={6} className="mb-3">
            <h4 className="mb-3">Employee Code</h4>
            <Form.Control
              name="empCode"
              placeholder="Enter Employee Code"
              value={formData.empCode}
              onChange={handleChange}
            />
          </Col>
          <Col xs={12} md={12} lg={6} className="mb-3">
            <h4 className="mb-3">Doctor Full Name</h4>
            <Form.Control
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              maxLength={21}
              onChange={handleChange}
            />
          </Col>
          <Col xs={12} md={12} lg={6} className="mb-3">
            <h4 className="mb-3">Select Division</h4>
            <Form.Select
              name="div"
              value={formData.div}
              onChange={handleChange}
            >
              <option value="">Select Division</option>
              <option value="Glycekare">Glycekare</option>
              <option value="Vazokare">Vazokare</option>
              <option value="Suprakare">Suprakare</option>
              <option value="Osteokare">Osteokare</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={12} lg={6} className="mb-3">
            <h4 className="mb-3">Contact Number</h4>
            <Form.Control
              name="contNo"
              placeholder="Enter Contact No."
              value={formData.contNo}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Button onClick={() => setModalOpen(true)} className="me-3">
          Choose Image
        </Button>
        <Button onClick={handleCreateCertificate}>Preview Image</Button>

        {docImgUrl && (
          <Row className="my-3">
            <Col xs={12}>
              <img
                src={docImgUrl}
                alt="Stamp Preview"
                style={{
                  maxWidth: "200px",
                  height: "auto",
                  borderRadius: "50%", // This makes the image circular
                  objectFit: "cover", // Ensures the image covers the entire circle without stretching
                }}
              />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  </Col>

  {modalOpen && (
    <Modal
      closeModal={() => setModalOpen(false)}
      updateAvatar={updateAvatar}
      src={docImgUrl}
    />
  )}
</Row>
</> */
}
