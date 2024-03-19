import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; // Import NavLink
import logo from '../img/logo.png'; // Ensure the path is correct

const MyNavbar = () => {
    // Function to determine the link's class based on its active state
    const getNavLinkClass = (isActive) => {
        return isActive ? "nav-link active" : "nav-link";
    };

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={NavLink} to="/" className={({ isActive }) => getNavLinkClass(isActive)}>
                    <img src={logo} height="30" className="d-inline-block align-top" alt="Logo"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" className={({ isActive }) => getNavLinkClass(isActive)}>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard" className={({ isActive }) => getNavLinkClass(isActive)}>Dashboard</Nav.Link>
                        <Nav.Link as={NavLink} to="/sea" className={({ isActive }) => getNavLinkClass(isActive)}>Sea</Nav.Link>
                        <Nav.Link as={NavLink} to="/about" className={({ isActive }) => getNavLinkClass(isActive)}>About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
