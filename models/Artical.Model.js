// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;

const { Schema ,model} = require("mongoose");
const mongoose = require("mongoose");

// BodySubtitle Schema
const BodySubtitleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String },
});

// SubSubTitle Schema
const SubSubTitleSchema = new Schema({
  title: { type: String, required: true },
  bodySubtitle: [BodySubtitleSchema],
});

// Subtitle Schema
const SubtitleSchema = new Schema({
  title: { type: String, required: true },
  subsubtitle: [SubSubTitleSchema],
});

// MainTitle Schema
const MainTitleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: String, required: true },
  publicationDate: { type: Date, default: Date.now },
  tags: [{ type: String }],
  subtitles: [SubtitleSchema],
  thumbnail: {
    public_id: {
      type: String,
      required: true, // Public ID for the thumbnail is required
    },
    url: {
      type: String,
      required: true, // URL of the thumbnail is required
    },
  },
});

// Create and export the model
const ArticalModel = model("Artical", MainTitleSchema);

module.exports = { ArticalModel };
