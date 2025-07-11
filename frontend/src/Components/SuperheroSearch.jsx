import { useCallback, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

const defaultPoster =
  "https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg";

const ITEMS_PER_PAGE = 8;

const SuperheroSearch = ({ credentials, favorites, setFavorites }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!credentials.username || !credentials.password) {
      navigate("/authentication");
    }
  }, [credentials, navigate]);

  const fetchData = useCallback(async () => {
    if (!query) {
      setResults([]);
      setCurrentPage(1);
      return;
    }

    try {
      const authString = `${credentials.username}:${credentials.password}`;
      const base64AuthString = btoa(authString);

      const response = await fetch(
        `http://localhost:8000/superhero?query=${query}`,
        {
          headers: {
            Authorization: `Basic ${base64AuthString}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching superhero data:", error);
    }
  }, [credentials.username, credentials.password, query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleFavorite = (hero) => {
    console.log("toggleFavorite called for hero:", hero);
    const isFavorited = favorites.some((fav) => fav.id === hero.id);
    if (isFavorited) {
      const newFavorites = favorites.filter((fav) => fav.id !== hero.id);
      console.log("Removing from favorites:", newFavorites);
      setFavorites(newFavorites);
    } else {
      const newFavorites = [...favorites, { ...hero, type: "superhero" }];
      console.log("Adding to favorites:", newFavorites);
      setFavorites(newFavorites);
    }
  };

  const toggleShowDetails = (id) => {
    setShowDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

  const displayedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Container>
      <h2>Search Superhero</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <Label for="query">Hero Name:</Label>
          <Input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "300px" }}
          />
        </FormGroup>
      </Form>

      <div>
        <h3>Results:</h3>
        <Row>
          {displayedResults.map((hero) => (
            <Col key={hero.id} xs="12" sm="6" md="4" lg="3" className="mb-4">
              <Card className="h-100">
                <div style={{ position: "relative" }}>
                  <CardImg
                    top
                    width="100%"
                    src={hero.image?.url || defaultPoster}
                    alt={hero.name}
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
                    }}
                    onClick={() => toggleFavorite(hero)}
                    aria-label={
                      favorites.some((fav) => fav.id === hero.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorites.some((fav) => fav.id === hero.id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart color="white" />
                    )}
                  </div>
                </div>
                <CardBody>
                  <CardTitle tag="h5">{hero.name}</CardTitle>

                  <CardText>
                    <strong>Full Name:</strong>{" "}
                    {hero.biography?.["full-name"] || "N/A"}
                  </CardText>
                  <CardText>
                    <strong>Aliases:</strong>{" "}
                    {hero.biography?.aliases?.join(", ") || "N/A"}
                  </CardText>
                  <CardText>
                    <strong>Place of Birth:</strong>{" "}
                    {hero.biography?.["place-of-birth"] || "N/A"}
                  </CardText>

                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => toggleShowDetails(hero.id)}
                    style={{ marginBottom: "10px" }}
                  >
                    {showDetails[hero.id] ? "Hide Details" : "Show Details"}
                  </Button>

                  {showDetails[hero.id] && (
                    <>
                      <CardText>
                        <strong>Alignment:</strong>{" "}
                        {hero.biography?.alignment || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Gender:</strong>{" "}
                        {hero.appearance?.gender || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Race:</strong> {hero.appearance?.race || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Height:</strong>{" "}
                        {hero.appearance?.height?.join(" / ") || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Weight:</strong>{" "}
                        {hero.appearance?.weight?.join(" / ") || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Eye Color:</strong>{" "}
                        {hero.appearance?.["eye-color"] || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Hair Color:</strong>{" "}
                        {hero.appearance?.["hair-color"] || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Occupation:</strong>{" "}
                        {hero.work?.occupation || "N/A"}
                      </CardText>
                      <CardText>
                        <strong>Base:</strong> {hero.work?.base || "N/A"}
                      </CardText>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem 0",
            }}
          >
            <Button
              color="primary"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ marginRight: "0.5rem" }}
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <Button
                  key={page}
                  color={page === currentPage ? "secondary" : "primary"}
                  onClick={() => goToPage(page)}
                  style={{ marginRight: "0.5rem" }}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              color="primary"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default SuperheroSearch;
