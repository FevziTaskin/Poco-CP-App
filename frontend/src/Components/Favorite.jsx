import React from "react";
import { FaHeart } from "react-icons/fa";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";

const defaultMoviePoster =
  "https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg";
const defaultHeroPoster =
  "https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg";

const Favorites = ({ favorites, setFavorites }) => {
  const [showDetails, setShowDetails] = React.useState({});

  const toggleShowDetails = (id) => {
    setShowDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeFavorite = (item) => {
    if (item.type === "movie") {
      setFavorites((prev) => prev.filter((fav) => fav.imdbID !== item.imdbID));
    } else if (item.type === "superhero") {
      setFavorites((prev) => prev.filter((fav) => fav.id !== item.id));
    }
  };

  // Separating movie and superhero favorites
  const favoriteMovies = favorites.filter((f) => f.type === "movie");
  const favoriteHeroes = favorites.filter((f) => f.type === "superhero");

  return (
    <Container>
      <h2>Favorites</h2>

      {/* Movies favorites */}
      <section style={{ marginBottom: "3rem" }}>
        <h3>Movies</h3>
        {favoriteMovies.length === 0 && <p>No favorite movies added yet.</p>}
        <Row>
          {favoriteMovies.map((item) => (
            <Col
              key={item.imdbID}
              xs="12"
              sm="6"
              md="4"
              lg="3"
              className="mb-4"
            >
              <Card className="h-100">
                <div style={{ position: "relative" }}>
                  <CardImg
                    top
                    width="100%"
                    src={
                      item.Poster !== "N/A" ? item.Poster : defaultMoviePoster
                    }
                    alt={item.Title}
                    style={{
                      height: "350px",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      color: "red",
                    }}
                    onClick={() => removeFavorite(item)}
                  >
                    <FaHeart />
                  </div>
                </div>
                <CardBody>
                  <CardTitle tag="h5">{item.Title}</CardTitle>
                  <CardText>{item.Year}</CardText>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => toggleShowDetails(item.imdbID)}
                    style={{ marginBottom: "10px" }}
                  >
                    {showDetails[item.imdbID] ? "Hide Details" : "Show Details"}
                  </Button>
                  {showDetails[item.imdbID] && (
                    <>
                      {item.Plot && (
                        <CardText>
                          <small>{item.Plot}</small>
                        </CardText>
                      )}
                      {item.Genre && (
                        <CardText>
                          <strong>Genre:</strong> {item.Genre}
                        </CardText>
                      )}
                      {item.Actors && (
                        <CardText>
                          <strong>Actors:</strong> {item.Actors}
                        </CardText>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Superheroes favorites */}
      <section>
        <h3>Superheroes</h3>
        {favoriteHeroes.length === 0 && (
          <p>No favorite superheroes added yet.</p>
        )}
        <Row>
          {favoriteHeroes.map((item) => (
            <Col key={item.id} xs="12" sm="6" md="4" lg="3" className="mb-4">
              <Card className="h-100">
                <div style={{ position: "relative" }}>
                  <CardImg
                    top
                    width="100%"
                    src={item.image?.url || defaultHeroPoster}
                    alt={item.name}
                    style={{
                      height: "350px",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      color: "red",
                    }}
                    onClick={() => removeFavorite(item)}
                  >
                    <FaHeart />
                  </div>
                </div>
                <CardBody>
                  <CardTitle tag="h5">{item.name}</CardTitle>
                  <CardText>
                    <strong>Full Name:</strong>{" "}
                    {item.biography?.["full-name"] || "N/A"}
                  </CardText>
                  <CardText>
                    <strong>Aliases:</strong>{" "}
                    {item.biography?.aliases?.join(", ") || "N/A"}
                  </CardText>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => toggleShowDetails(item.id)}
                    style={{ marginBottom: "10px" }}
                  >
                    {showDetails[item.id] ? "Hide Details" : "Show Details"}
                  </Button>
                  {showDetails[item.id] && (
                    <>
                      <CardText>
                        <strong>Publisher:</strong>{" "}
                        {item.biography?.publisher || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Alignment:</strong>{" "}
                        {item.biography?.alignment || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>First Appearance:</strong>{" "}
                        {item.biography?.["first-appearance"] || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Place of Birth:</strong>{" "}
                        {item.biography?.["place-of-birth"] || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Occupation:</strong>{" "}
                        {item.work?.occupation || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Connections:</strong>{" "}
                        {item.connections?.relatives || "N/A"}
                      </CardText>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default Favorites;
