const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
  },
  questionTopic: {
    type: String,
    required: true,
  },
});

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true,
  },
  interviewType: {
    type: String,
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  interviewQuestion: [interviewQuestionSchema], // Reference to interviewQuestion schema
  interviewDifficulty: {
    type: String,
    required: true,
  },
  interviewFeedback: {
    type: String,
    required: true,
  },
  outcome: {
    type: String,
    required: true,
  },
  preparationMaterials: {
    type: [String], // Array of strings
  },
});

const interviewExperienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  jobPosition: {
    type: String,
    required: true,
  },
  finalOutcome: {
    type: String,
    required: true,
  },
  rounds: [roundSchema], // Array of rounds
});

const InterviewExperienceModel = mongoose.model(
  "InterviewExperience",
  interviewExperienceSchema
);

module.exports = InterviewExperienceModel;
