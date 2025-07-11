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

const years = Array.from({ length: 2024 - 1970 + 1 }, (_, i) => 1970 + i);

const Search = ({ credentials, favorites, setFavorites }) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDetails, setShowDetails] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!credentials.username || !credentials.password) {
      navigate("/authentication");
    }
  }, [credentials, navigate]);

  const fetchData = useCallback(
    async (pageNum = 1) => {
      if (!query && !type && !year) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setHasSearched(true);

      try {
        const authString = `${credentials.username}:${credentials.password}`;
        const base64AuthString = btoa(authString);

        const response = await fetch(
          `http://localhost:8000/movies?query=${encodeURIComponent(
            query
          )}&type=${encodeURIComponent(type)}&year=${encodeURIComponent(
            year
          )}&page=${pageNum}`,
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

        // First 8 card
        setResults(data.Search?.slice(0, 8) || []);
        setTotalResults(Number(data.totalResults) || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [credentials.username, credentials.password, query, type, year]
  );

  useEffect(() => {
    if (query || type || year) {
      setPage(1);
      fetchData(1);
    } else {
      setHasSearched(false);
      setResults([]);
    }
  }, [fetchData, query, type, year]);

  const toggleFavorite = (movie) => {
    const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    if (isFavorite) {
      // remove from favorites
      setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
    } else {
      // Add to favorites
      setFavorites([...favorites, { ...movie, type: "movie" }]);
    }
  };

  const toggleShowDetails = (imdbID) => {
    setShowDetails((prev) => ({ ...prev, [imdbID]: !prev[imdbID] }));
  };

  const getSafePoster = (posterUrl) => {
    if (
      !posterUrl ||
      posterUrl.trim() === "" ||
      posterUrl === "N/A" ||
      posterUrl === "null"
    ) {
      return defaultPoster;
    }
    return posterUrl;
  };

  const handlePosterError = (e) => {
    e.target.onerror = null;
    e.target.src = defaultPoster;
  };

  const handleCardClick = (imdbID) => {
    const url = `https://www.imdb.com/title/${imdbID}/`;
    window.open(url, "_blank");
  };

  const totalPages = Math.ceil(totalResults / 8);

  const handlePageClick = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
    fetchData(pageNumber);
  };

  // Pagination function
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];

    const start = Math.max(1, page < 4 ? 1 : page - 1);
    const end = Math.min(start + 3, totalPages - 1);

    // Prev
    if (page > 1) {
      pages.push(
        <Button
          key="prev"
          onClick={() => handlePageClick(page - 1)}
          className="me-1"
        >
          {"<"}
        </Button>
      );
    }

    // Show first page only if you are in the first 4 page
    if (start > 1) {
      pages.push(
        <Button key={1} onClick={() => handlePageClick(1)} className="me-1">
          1
        </Button>
      );
    }

    // page range
    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageClick(i)}
          className="me-1"
          color={page === i ? "primary" : "secondary"}
        >
          {i}
        </Button>
      );
    }

    // Elipsis + last page
    if (end < totalPages - 1) {
      pages.push(<span key="dots">...</span>);
    }

    if (totalPages > 1 && page !== totalPages) {
      pages.push(
        <Button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className="ms-1 me-1"
        >
          {totalPages}
        </Button>
      );
    }

    // next
    if (page < totalPages) {
      pages.push(
        <Button
          key="next"
          onClick={() => handlePageClick(page + 1)}
          className="ms-1"
        >
          {">"}
        </Button>
      );
    }

    return <div className="d-flex justify-content-center mt-4">{pages}</div>;
  };

  return (
    <Container>
      <h2>Search Movies or Series</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <Label for="query">Search:</Label>
          <Input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "300px" }}
            placeholder="Enter movie or series name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">Type:</Label>
          <Input
            type="select"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: "300px" }}
          >
            <option value="">Select Type</option>
            <option value="movie">movie</option>
            <option value="series">series</option>
            <option value="episode">episode</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="year">Year:</Label>
          <Input
            type="select"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ width: "300px" }}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Form>

      {!hasSearched ? (
        <h4>Please make a search to see some movies or series.</h4>
      ) : (
        <>
          <h3>Results:</h3>
          <Row>
            {results.map((item) => {
              const posterSrc = getSafePoster(item.Poster);
              return (
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
                        src={posterSrc}
                        alt={item.Title}
                        onError={handlePosterError}
                        style={{
                          height: "350px",
                          objectFit: "cover",
                          objectPosition: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleCardClick(item.imdbID)}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          cursor: "pointer",
                          fontSize: "1.5rem",
                        }}
                        onClick={() => toggleFavorite(item)}
                      >
                        {favorites.some((fav) => fav.imdbID === item.imdbID) ? (
                          <FaHeart color="red" />
                        ) : (
                          <FaRegHeart color="white" />
                        )}
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
                        {showDetails[item.imdbID]
                          ? "Hide Details"
                          : "Show Details"}
                      </Button>

                      {showDetails[item.imdbID] && (
                        <>
                          {item.Plot && (
                            <CardText>
                              <small className="text-muted">{item.Plot}</small>
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
              );
            })}
          </Row>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default Search;
