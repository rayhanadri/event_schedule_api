const express = require("express");
const cors = require("cors");
// const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

require("./utils/db");
// const Contact = require("./model/contact");
const Event = require("./model/event");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 8000;
app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON request body
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//setup method override
app.use(methodOverride("_method"));

//Setup EJS
// app.set("view engine", "ejs");
// app.use(expressLayouts);
// app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//halaman Home
app.get("/", (req, res) => {
  const response = [
    {
      description: "available route /api/v1/list",
      currentUrl: "/",
    },
  ];
  res.json(response);
});

app.get("/api/v1/list", async (req, res) => {
  const events = await Event.find().sort({ eventTimeStart: 1 });

  res.json(events);
});

app.post("/api/v1/addEvent", async (req, res) => {
  // return res.json(req.body);

  try {
    const {
      name,
      description,
      eventTimeStart,
      eventTimeEnd,
      eventCategories,
      urlInfo,
      city,
      venue,
    } = req.body;
    // console.log(req);
    //
    const eventName = req.body.name;
    //
    // console.log(req.body); // Log the body for debugging
    console.log("Event name:", eventName);
    // console.log(req.body);

    const existingEvent = await Event.findOne({
      name: { $regex: new RegExp("^" + eventName + "$", "i") }, // Case-insensitive
    });

    // console.log("Existing event:", existingEvent); // Debug query result

    if (existingEvent) {
      return res
        .status(400)
        .json({ message: "Event with this name already exists.", event: existingEvent });
    }

    // Basic validation to check if required fields are provided
    if (
      !name ||
      !description ||
      !eventTimeStart ||
      !eventTimeEnd ||
      !eventCategories
    ) {
      return res.status(400).json({
        body: req.body,
        error:
          "Please provide all required fields: name, description, eventTimeStart, eventTimeEnd, eventCategories",
      });
    }

    // Create a new event using the data from the request body
    const newEvent = new Event({
      name: eventName,
      description,
      eventTimeStart: new Date(eventTimeStart), // Convert to Date object if it's a string
      eventTimeEnd: new Date(eventTimeEnd), // Convert to Date object if it's a string
      eventCategories,
      urlInfo,
      city,
      venue,
    });

    console.log(newEvent);

    // Save the new event to the database
    await newEvent.save();

    // Return the created event as a response
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ error: "An error occurred while adding the event" });
  }
});

app.get("/api/v1/search", async (req, res) => {
  try {
    const { key } = req.query; // Get the 'key' query parameter

    // If no 'key' query is provided, return all events
    if (!key) {
      const events = await Event.find();
      return res.json(events);
    }

    // Search for events by name or description using regex (case-insensitive)
    const events = await Event.find({
      $or: [
        { name: { $regex: key, $options: "i" } },
        { description: { $regex: key, $options: "i" } },
      ],
    });

    // Return the results
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "An error occurred while fetching events" });
  }
});

app.get("/api/v1/category", async (req, res) => {
  try {
    const { category } = req.query; // Get the 'category' query parameter

    // If no 'category' query is provided, return an error or all events
    if (!category) {
      return res.status(400).json({ error: "Category parameter is required" });
    }

    // Search for events where 'eventCategories' contains the specified category
    const events = await Event.find({
      eventCategories: { $in: [category] }, // Find events with the specified category in 'eventCategories'
    });

    // If no events are found
    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: `No events found with category '${category}'` });
    }

    // Return the results
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "An error occurred while fetching events" });
  }
});

app.listen(port, () => {
  console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});
