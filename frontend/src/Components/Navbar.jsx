import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Nav,
  NavbarBrand,
  NavItem,
  NavLink,
  Navbar as RSNavbar,
} from "reactstrap";

const Navbar = ({ auth, setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(false);
    navigate("/authentication");
  };

  return (
    <RSNavbar color="dark" dark expand className="mb-4 p-2">
      <NavbarBrand tag={Link} to="/search" className="me-5">
        OMDb Movie App
      </NavbarBrand>
      <Nav className="me-auto" navbar>
        <NavItem>
          <NavLink tag={Link} to="/authentication" className="text-light">
            Authentication
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/search" className="text-light">
            Search Movies / Series
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/superhero-search" className="text-light">
            Search Superhero
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/favorite" className="text-light">
            Favorites
          </NavLink>
        </NavItem>
        {auth && (
          <NavItem>
            <Button color="secondary" onClick={handleLogout} className="ms-2">
              Logout
            </Button>
          </NavItem>
        )}
      </Nav>
    </RSNavbar>
  );
};

export default Navbar;
