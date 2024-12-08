const mongoose = require("mongoose");

const Event =  mongoose.models.Event || mongoose.model("Event", {
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  eventTimeStart: {
    type: Date,
  },
  eventTimeEnd: {
    type: Date,
  },
  eventCategories: {
    type: [String],
  },
  urlInfo: {
    type: String,
  },
  city: {
    type: String,
  },
  venue: {
    type: String,
  },
});

mongoose.connection.once('open', () => {
  console.log("MongoDB connected successfully!");
});

module.exports = Event;
