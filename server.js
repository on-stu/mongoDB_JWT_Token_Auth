const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "asdfainwon3249858e8dsnjadif";

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

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET
    );
    return res.json({ status: "ok", data: token });
  } else {
    return res.json({ status: "error", error: "password is incorrect" });
  }
});

app.post("/api/register", async (req, res) => {
  //Hashing the passwords

  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (typeof password !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (password.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small, it should have more than 5 characters",
    });
  }

  try {
    const response = await User.create({
      username,
      password: hashedPassword,
    });
    console.log("successful with", response);
  } catch (error) {
    if (error.code === 11000) {
      console.log("this username is already used");
      return res.json({ status: "error", error: "Username already in use" });
    }
  }

  console.log(hashedPassword);
  res.json({ status: "ok" });
});

app.post("/api/change-password", async (req, res) => {
  const { token, newpassword } = req.body;

  if (typeof newpassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (newpassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small, it should have more than 5 characters",
    });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await User.updateOne(
      { _id },
      {
        $set: { password: hashedPassword },
      }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "?" });
  }
});

app.listen(9999, () => {
  console.log("Server up at 9999");
});
