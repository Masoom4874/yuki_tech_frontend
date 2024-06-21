import { useRef, useState } from "react";
import PencilIcon from "./PencilIcon";
import Modal from "./Modal";
import { Row, Col, Form, Button } from "react-bootstrap";
import homePageImg from "../assets/homePageImg.jpg";
import templateImg from "../assets/templateImg.jpg";

const Profile = () => {
  const [name, setName] = useState("");

  // Temp Data
  const [empCode, setEmpCode] = useState("");
  const [div, setDiv] = useState("");
  const [contNo, setContNo] = useState("");

  const [docImg, setDocImg] = useState(null);
  const [docImgUrl, setDocImgUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
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

  const [croppedImg, setCroppedImg] = useState(null);
  const updateAvatar = (croppedImageUrl) => {
    setDocImgUrl(croppedImageUrl); // Update preview immediately
    setCroppedImg(croppedImageUrl); // Save cropped image data URL
    setModalOpen(false); // Close modal after cropping
  };

  const avatarUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );

  // Creating Certificate
  const handleCreateCertificate = () => {
    // Check if name is provided
    if (!name) {
      alert("Please Enter Name");
      return;
    }

    // Check if image data is available
    if (!croppedImg) {
      alert("Please Upload Image");
      return;
    }

    // Create a new image
    const templateImage = new Image();
    templateImage.src = templateImg;

    // Load the template image to get its dimensions
    templateImage.onload = () => {
      const imgWidth = 800; // Reduced width of the template image
      const imgHeight = 1400; // Reduced height of the template image

      // Create a canvas element with the new resolution
      const canvas = document.createElement("canvas");
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      const ctx = canvas.getContext("2d");

      // Draw the template image
      ctx.drawImage(templateImage, 0, 0, imgWidth, imgHeight);

      // Set font size and add text for name
      ctx.font = "24px Arial"; // Set font to Arial with size 32px
      ctx.fillStyle = "#FFFFFF";
      const fullName = `Dr. ${name}`;
      const textWidth = ctx.measureText(fullName).width;
      const textX = (imgWidth - textWidth) / 2;
      ctx.fillText(fullName, textX, 860);

      // Function to render image in a circular shape (if needed)
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

      // Add cropped image (if needed)
      const img = new Image();
      img.src = croppedImg;
      img.onload = () => {
        const imgSize = 415; // Reduced diameter of the circular image
        const x = imgWidth / 2 - imgSize / 2 + 2; // Centered horizontally
        const y = imgHeight / 2 - imgSize / 2 - 128; // Centered vertically

        // Render circular image
        renderCircularImage(img, x, y, imgSize);

        // Convert canvas to JPEG data URL
        const jpegUrl = canvas.toDataURL("image/jpeg", 1.0); // Increased image quality

        // Set the preview image
        setPreviewImage(jpegUrl);
      };
    };
  };

  const handleDownload = () => {
    if (previewImage) {
      const link = document.createElement("a");
      link.href = previewImage;
      link.download = "certificate.jpg";
      link.click();
    }
  };

  return (
    <>
      {!previewImage ? (
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
                    <Form.Control placeholder="Enter Employee Code" />
                  </Col>
                  <Col xs={12} md={12} lg={6} className="mb-3">
                    <h4 className="mb-3">Doctor Full Name</h4>
                    <Form.Control
                      placeholder="Enter Name"
                      value={name}
                      maxLength={21}
                      onChange={handleNameChange}
                    />
                  </Col>
                  <Col xs={12} md={12} lg={6} className="mb-3">
                    <h4 className="mb-3">Select Division</h4>
                    <Form.Select>
                      <option value="">Select Division</option>
                      <option value="Glycekare">Glycekare</option>
                      <option value="Vazokare">Vazokare</option>
                      <option value="Suprakare">Suprakare</option>
                      <option value="Osteokare">Osteokare</option>
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={12} lg={6} className="mb-3">
                    <h4 className="mb-3">Contact Number</h4>
                    <Form.Control placeholder="Enter Contact No." />
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
      ) : (
        <div style={{ textAlign: "center" }} className="p-3">
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
              className="d-flex justify-content-start align-self-start"
            >
              <Button onClick={handleDownload} className="mt-3 mt-md-0">
                Download Image
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Profile;
