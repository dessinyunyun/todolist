import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import React from "react";

function Navbarcomponents() {
  return (
    <>
      <Navbar bg="primary" className="navbar" data-cy="navbar">
        <Container>
          <Navbar.Brand href="#home" className="text-white py-3" data-cy="navbar-brand">
            <h1 className="fw-bold fs-4" data-cy="header-title">
              TO DO LIST APP
            </h1>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarcomponents;
