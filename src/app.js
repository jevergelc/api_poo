/**
 * Configuración principal de Express.
 */
const path = require("path");
const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { errorMiddleware } = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1", routes);

app.use(errorMiddleware);

module.exports = app;
