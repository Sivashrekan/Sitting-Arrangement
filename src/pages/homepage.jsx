import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

function Homepage() {
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <h1 className="logo">Student Sitting Arrangement</h1>

        <nav>
          <ul className="nav-links">
            <li onClick={() => navigate("/adminlog")}>Admin Login</li>
            <li onClick={() => navigate("/student-login")}>Student Login</li>
            <li onClick={() => navigate("/staff-login")}>Staff Login</li>
          </ul>
        </nav>
      </div>

      {/* MAIN SECTION */}
      <div className="mainpage">
        <div className="content-area">
          <h1 className="title">
            Welcome to Student Sitting Arrangement System
          </h1>

          <div className="card">
            <h2>About Us</h2>
            <p>
              Our Student Sitting Arrangement System helps educational
              institutions efficiently manage exam and event seating arrangements
              with a modern and easy-to-use interface.
            </p>
          </div>

          <div className="card">
            <h2>Features</h2>
            <ul className="feature-list">
              <li>Simple interface for creating seating plans</li>
              <li>Customizable seating based on requirements</li>
              <li>Secure admin authentication</li>
              <li>Fully responsive design</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <h4>© 2025 Sitting Arrangement by Sivashrekan</h4>
      </div>
    </>
  );
}

export default Homepage;
