import { useRef, useState } from "react";
import PencilIcon from "./PencilIcon";
import Modal from "./Modal";
import jsPDF from "jspdf";
import { Row, Col, Form, Button } from "react-bootstrap";
import homePageImg from "../assets/homePageImg.jpg";
import templateImg from "../assets/templateImg.jpg";
const Profile = () => {
  const [name, setName] = useState("");
  const [docImg, setDocImg] = useState(null);
  const [docImgUrl, setDocImgUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const [cropppedImg, setCroppedImg] = useState(null);
  const updateAvatar = (croppedImageUrl) => {
    setDocImgUrl(croppedImageUrl); // Update preview immediately
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

    // Retrieve cropped image data from localStorage
    const imgData = localStorage.getItem("croppedImage");

    // Check if image data is available
    if (!imgData) {
      alert("Please Upload Image");
      return;
    }

    // Create a new jsPDF document with A5 size (portrait)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });

    // Add background template image (assuming templateImg is already defined)
    doc.addImage(templateImg, "JPEG", 0, 0, 148, 210); // Adjust width as needed

    // Set font size and add text for name
    doc.setFont("times"); // Set font to Times
    doc.setFontSize(24); // Set font size to 24
    doc.setTextColor(14, 133, 189); // Set text color to red (RGB)
    const fullName = `Dr. ${name}`;
    doc.text(fullName, 74, 154, { align: "center" }); // Centered horizontally

    // Function to render image in a circular shape
    const renderCircularImage = (img, x, y, diameter) => {
      const clipX = x; // X position of the clip circle
      const clipY = y; // Y position of the clip circle
      const clipRadius = diameter / 2; // Radius of the clip circle

      // Clip the area where the image will be placed
      doc.circle(clipX + clipRadius, clipY + clipRadius, clipRadius, "S");
      doc.clip(); // Clip to the circular area

      // Add white background circle
      doc.setFillColor(255, 255, 255);
      doc.circle(clipX + clipRadius, clipY + clipRadius, clipRadius, "F");

      // Add the image
      doc.addImage(img, x, y, diameter, diameter);

      doc.clip("stroke"); // Reset clipping path
    };

    // Add cropped image in a circular shape to the certificate
    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      const imgSize = 76.5; // Diameter of the circular image
      const x = 74 - imgSize / 2; // Centered horizontally
      const y = 52.5; // Fixed vertical position

      // Render circular image
      renderCircularImage(img, x, y, imgSize);

      // Generate PDF as a blob
      const pdfBlob = doc.output("blob");

      // Create a blob URL for the PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank");

      // Clean up the blob URL after opening
      URL.revokeObjectURL(pdfUrl);
    };
  };

  return (
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
                <h4 className="mb-3">Doctor Full Name</h4>
                <Form.Control
                  placeholder="Enter Name"
                  value={name}
                  onChange={handleNameChange}
                />
              </Col>
            </Row>

            <Button onClick={() => setModalOpen(true)}>Choose Image</Button>

            {docImgUrl && (
              <Row className="my-3">
                <Col xs={12}>
                  <img
                    src={docImgUrl}
                    alt="Stamp Preview"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "50%", // This makes the image circular
                      objectFit: "cover", // Ensures the image covers the entire circle without stretching
                    }}
                  />
                </Col>
              </Row>
            )}

            <Button onClick={handleCreateCertificate}>Download E-Card</Button>
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
  );
};

export default Profile;
