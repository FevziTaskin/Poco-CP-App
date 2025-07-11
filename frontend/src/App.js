import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Authentication from "./Components/Authentication";
import Favorite from "./Components/Favorite";
import Navbar from "./Components/Navbar";
import Search from "./Components/Search";
import SuperheroSearch from "./Components/SuperheroSearch";

const App = () => {
  // States for authentication and favorites
  const [auth, setAuth] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [favorites, setFavorites] = useState([]);

  // Routes
  return (
    <Router>
      <Navbar auth={auth} setAuth={setAuth} />
      <Routes>
        <Route path="/" element={<Navigate to="/authentication" />} />
        <Route
          path="/authentication"
          element={
            <Authentication setAuth={setAuth} setCredentials={setCredentials} />
          }
        />
        <Route
          path="/search"
          element={
            auth ? (
              <Search
                credentials={credentials}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ) : (
              <Navigate to="/authentication" />
            )
          }
        />
        <Route
          path="/superhero-search"
          element={
            auth ? (
              <SuperheroSearch
                credentials={credentials}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ) : (
              <Navigate to="/authentication" />
            )
          }
        />
        <Route
          path="/favorite"
          element={
            auth ? (
              <Favorite
                credentials={credentials}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ) : (
              <Navigate to="/authentication" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
