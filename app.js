const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;
const initailizeDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("http://localhost:3000/ running...");
    });
  } catch (e) {
    console.log(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

initailizeDb();
const movie = (query) => {
  return {
    movieId: query.movie_id,
    directorId: query.director_id,
    movieName: query.movie_name,
    leadActor: query.lead_actor,
  };
};

const director = (m) => {
  return {
    directorId: m.director_id,
    directorName: m.director_name,
  };
};

app.get("/movies/", async (request, response) => {
  let getQuery = `SELECT * FROM movie;`;
  let query = await db.all(getQuery);
  response.send(query.map((n) => ({ movieName: n.movie_name })));
});

app.get("/directors/", async (request, response) => {
  let getQuery = `SELECT * FRom director;`;
  let query = await db.all(getQuery);
  response.send(
    query.map((m) => ({
      directorId: m.director_id,
      directorName: m.director_name,
    }))
  );
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  let getQuery = `SELECT movie_name FROM movie WHERE director_id=${directorId};`;
  let query = await db.all(getQuery);
  response.send(query.map((n) => ({ movieName: n.movie_name })));
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  let getQuery = `DELETE FROM movie WHERE movie_id='${movieId}';`;
  let query = await db.all(getQuery);
  response.send("Movie Removed");
});

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  let getQuery = `UPDATE movie SET director_id=${directorId},movie_name='${movieName}',lead_actor='${leadActot}' WHERE movie_id=${movieId};`;
  let query = await db.run(getQuery);
  response.send("Movie Details Updated");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  let getQuery = `SELECT * FROM movie WHERE movie_id=${movieId}`;
  let query = await db.get(getQuery);
  response.send(movie(query));
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
  INSERT INTO
    movie ( director_id, movie_name, lead_actor)
  VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});
module.exports = app;
