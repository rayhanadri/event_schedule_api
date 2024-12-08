
# Event Schedule API

API for scheduling various events. Created on Node.JS back-end.

Still Work In Progress (WIP)

## Installation
1. Clone the repo
`https://github.com/rayhanadri/event_schedule_api.git`

2. Open directory event_schedule_api
`cd event_schedule_api`

3. Add node modules using npm install 
`npm install`

4. Create .env to connect to MongoDb
`MONGODB_URI=mongodb://127.0.0.1:27017/eventsch`

5. Run the app using nodemon or node with main file to app.js
`nodemon app`

## API Route
1. Show list of events
   (GET) `http://localhost:8000/api/v1/list`
3. Search event by name or description
   (GET) `http://localhost:8000/api/v1/search?key=comic`
5. Add new event
   (POST) `http://localhost:8000/api/v1/addEvent`
