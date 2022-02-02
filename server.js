require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const tweetsRoutes = require("./routes/api");

app.use([cors(), express.json()]);
app.use("/api/tweets", tweetsRoutes);

const port = process.env.PORT || 8000;
mongoose.connect(process.env.MONGODB_URI, () => {
  console.log("Connected to Mongo DB");
  app.listen(port, () => console.log(`Server started on port ${port}`));
});
