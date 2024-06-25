import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Pagination, Modal, Button } from "react-bootstrap";

const AdminPanel = () => {
  const [empList, setEmpList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const entriesPerPage = 10;

  useEffect(() => {
    const fetchEmpList = async () => {
      try {
        const res = await axios.get(
          "https://apexapi.progreet.app/api/v1/yuki/get-emp-data"
        );

        console.log(res.data.data);
        if (res.data.status) {
          setEmpList(res.data.data);
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        alert("Internal Server Error");
        console.error("something went wrong while fetching list");
      }
    };
    fetchEmpList();
  }, []);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = empList.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(empList.length / entriesPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const handleViewImage = (base64Image) => {
  //   const strippedBase64 = base64Image.replace(
  //     /^data:image\/(png|jpeg);base64,/,
  //     ""
  //   );
  //   setSelectedImage(`data:image/jpeg;base64,${strippedBase64}`);
  //   setShowModal(true);
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  //   setSelectedImage(null);
  // };

  return (
    <>
      <h2 className="mb-3 fs-2 fw-semibold">DOCTOR'S Day Activity List</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Employee Code</th>
            <th>Name</th>
            <th>Doctor Name</th>
            <th>Contact No.</th>
            <th className="text-center">Certificate</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((emp, index) => (
            <tr key={index}>
              <td>{indexOfFirstEntry + index + 1}</td>
              <td>{emp.empCode}</td>
              <td>{emp.compName}</td>
              <td>{emp.docName}</td>
              <td>{emp.contNo}</td>
              <td className="text-center">
                <a href={emp.cert} target="_blank" rel="noopener noreferrer">
                  view
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.First
          onClick={() => handleClick(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handleClick(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handleClick(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      {/* <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Preview Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img src={selectedImage} className="img-fluid" alt="Certificate" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default AdminPanel;
