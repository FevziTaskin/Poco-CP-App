const express = require("express");
const axios = require("axios");
const basicAuth = require("basic-auth");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authenticate = (req, res, next) => {
  const user = basicAuth(req);

  if (
    !user ||
    user.name !== process.env.USERNAME ||
    user.pass !== process.env.PASSWORD
  ) {
    res.set("WWW-Authenticate", 'Basic realm="example"');
    return res.status(401).send("Authentication required.");
  }

  next();
};

app.post("/login", authenticate, (req, res) => {
  res.json({ message: "Login successful" });
});

app.get("/movies", authenticate, async (req, res) => {
  const { query, type, year, page = 1 } = req.query;
  const apiKey = process.env.OMDb_API_KEY;

  try {
    // OMDb API araması (page parametresi ile)
    const searchResponse = await axios.get("http://www.omdbapi.com/", {
      params: {
        s: query,
        type: type || undefined,
        y: year || undefined,
        page,
        apikey: apiKey,
      },
    });

    const searchData = searchResponse.data;

    if (searchData.Response === "False") {
      return res.status(404).json({ error: searchData.Error });
    }

    // Films with details
    const moviesWithDetails = await Promise.all(
      searchData.Search.map(async (movie) => {
        const detailResponse = await axios.get("http://www.omdbapi.com/", {
          params: {
            i: movie.imdbID,
            apikey: apiKey,
          },
        });
        return detailResponse.data;
      })
    );

    res.json({
      totalResults: parseInt(searchData.totalResults),
      Search: moviesWithDetails,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Superhero route
app.get("/superhero", authenticate, async (req, res) => {
  const { query } = req.query;
  const token = process.env.SUPERHERO_API_KEY;

  try {
    const response = await axios.get(
      `https://superheroapi.com/api/${token}/search/${query}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Superhero API error:", error.message);
    res.status(500).json({ error: "Failed to fetch superhero data." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
