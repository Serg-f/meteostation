// src/components/BaseLayout.js
import React from 'react';
import '../css/base.css';
import MyNavbar from "./Navbar";

const BaseLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column" style={{minHeight: "100vh"}}>
      <MyNavbar />
      <main className="container flex-grow-1 mt-2 mt-md-5">
        {children}
      </main>
      <footer className="text-center text-lg-start bg-dark text-muted">
        <div className="text-center p-4">
            © 2024 Weather Station | All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;
