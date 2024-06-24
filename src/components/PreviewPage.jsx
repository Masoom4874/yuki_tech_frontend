import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

const PreviewPage = () => {
  const location = useLocation();
  const { imageUrl } = location.state;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "eCard.jpg";
    link.click();
  };

  return (
    <div className="text-center">
      <h1>Preview E-Card</h1>
      <img src={imageUrl} alt="E-Card Preview" style={{ maxWidth: "100%" }} />
      <Button onClick={handleDownload} className="mt-3">
        Download E-Card
      </Button>
    </div>
  );
};

export default PreviewPage;
