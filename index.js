require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Resource = require("./models/resource");
const res = require("express/lib/response");

// Basic Configuration
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:url", (req, res, next) => {
  Resource.findOne({ short_url: req.params.url })
    .select("-_id")
    .select("-__v")
    .then((resource) => {
      if (resource) {
        res.json(resource);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/shorturl", (req, res, next) => {
  const body = req.body;
  console.log("req body: ", req.body);
  if (body.url === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  // try to find resource with url
  Resource.findOne({ original_url: body.url })
    .then((resource) => {
      console.log("resource trying to find:", resource);
      if (resource) {
        console.log("found resource! ", resource);
        res.json(resource);
      } else {
        // if not found, create new resource
        Resource.countDocuments()
          .then((number) => {
            const resource = new Resource({
              original_url: body.url,
              short_url: number + 1,
            });
            console.log("resource: ", resource);
            resource
              .save()
              .then((resource) => {
                res.json(resource);
              })
              .catch((error) => next(error));
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
