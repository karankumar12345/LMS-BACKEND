const { Router } = require("express");

const { createInterviewExperience, updateExperience, accessSingleExperience, allInterviewExperience, deleteInterviewExperience } = require("../controllers/interviewexper");
const { isAuthenticated } = require("../middleware/auth");

const interviewExRouter = Router();

interviewExRouter.post("/add-interview", isAuthenticated, createInterviewExperience);
interviewExRouter.put("/update/:id", isAuthenticated, updateExperience);
interviewExRouter.get("/interviewexper/:id", accessSingleExperience);
interviewExRouter.get("/all-interviewexper", allInterviewExperience);
interviewExRouter.delete("/deleteexper/:id", isAuthenticated, deleteInterviewExperience);

module.exports = interviewExRouter;
