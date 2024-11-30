
const { Schema ,model} = require("mongoose");
const mongoose = require("mongoose");
// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    question: { 
      type: String, 
      required: true 
    },
    questionReplies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        answer: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

// Link Schema
const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }
});

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    rating: { 
      type: Number, 
      default: 0, 
      required: true 
    },
    comment: { 
      type: String, 
      default: "", 
      required: true 
    },
    commentReplies: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment" 
    }]
  },
  { timestamps: true }
);

// Subtitle Schema
const subtitleSchema = new mongoose.Schema({
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  videoThumbnail: { type: Object },
  videoLength: { type: Number },
  videoPlayer: { type: String, required: true },
  links: [linkSchema],
  suggestions: { type: String, required: true }
});

// Main Title Schema
const mainTitleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subtitles: [subtitleSchema],
  questions: [commentSchema]
});

// Course Schema
const courseSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    estimatedPrice: { 
      type: Number 
    },
    thumbnail: {
      public_id: { 
        type: String, 
        required: true 
      },
      url: { 
        type: String, 
        required: true 
      }
    },
    tags: { 
      type: String, 
      required: true 
    },
    level: { 
      type: String, 
      required: true 
    },
    demoUrl: { 
      type: String, 
      required: true 
    },
    benefits: [{ 
      title: { 
        type: String, 
        required: true 
      } 
    }],
    prerequisites: [{ 
      title: { 
        type: String, 
        required: true 
      } 
    }],
    reviews: [reviewSchema],
    courseData: [mainTitleSchema],
    ratings: { 
      type: Number 
    },
    purchased: { 
      type: Number 
    }
  },
  { timestamps: true }
);

// Create and export the models
const CourseModel = mongoose.model("Course", courseSchema);
const CommentModel = mongoose.model("Comment", commentSchema);
const LinkModel = mongoose.model("Link", linkSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const SubtitleModel = mongoose.model("Subtitle", subtitleSchema);
const MainTitleModel = mongoose.model("MainTitle", mainTitleSchema);

module.exports = {
  CourseModel,
  CommentModel,
  LinkModel,
  ReviewModel,
  SubtitleModel,
  MainTitleModel
};
