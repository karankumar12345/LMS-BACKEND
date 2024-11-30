const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userrouter = require('./routes/userroute');
const courseRouter = require('./routes/coursesrouter');
const ArticalRouter = require('./routes/articalrouter');
const interviewExRouter = require('./routes/interviewexper');
const errorMiddleware = require('./middleware/error');


require("dotenv").config();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json({ limit: "50mb" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for cookie parsing
app.use(cookieParser());

// CORS setup
console.log(process.env.ORIGIN);
app.use(
    cors({
      origin: [process.env.ORIGIN],
      credentials: true,
    })
  );

  //simple route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to the application." });
  });
// Routes
app.use("/api/v1/user", userrouter);
app.use("/api/v1/course", courseRouter);

app.use("/api/v1", ArticalRouter);
app.use("/api/v1/exper", interviewExRouter);

app.use(errorMiddleware);

module.exports = app;
