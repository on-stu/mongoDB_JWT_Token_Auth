const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user");
const bcrypt = require("bcryptjs");

mongoose.connect(
  "mongodb+srv://admin:ehdgoanf1!@youtubeclone.dbev2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (err) {
    if (err) {
      console.error(err);
    }
    console.log("mongoDb is connected");
  }
);

const app = express();

app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

app.post("/api/register", async (req, res) => {
  console.log(req.body);

  //Hashing the passwords

  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  res.json({ status: "ok" });
});

app.listen(9999, () => {
  console.log("Server up at 9999");
});
