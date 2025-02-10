const express = require("express");
const data = require("./data.json");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

const dataPath = path.join(__dirname, "/data.json");

const app = express();
const PORT = 8000;

//connecting mongo
mongoose
  .connect("mongodb://127.0.0.1:27017/project-1")
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log("db error", err);
  });

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model("user", userSchema);

app.use(express.urlencoded({ extended: false }));

//routes

app.get("/", (req, res) => {
  return res.end("welcome to prj-1");
});

app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${data.map((user) => `<li>${user.id}: ${user.name}</li>`).join("")}
        </ul>
    `;
  return res.send(html);
});

//! Rest api end points

// app.get("/api/users", (req, res) => {
//   return res.json(data);
// });

// app.use((req, res, next) => {
//   console.log("hello from middleware");
//   res.end("you're not allowed");
// });

app
  .route("/api/users")
  .get((req, res) => {
    res.setHeader("X-MyName", "dikshant");
    return res.json(data);
  })
  .put(async (req, res) => {
    const body = req.body;
    const newUser = { ...body, id: "1D1D" };
    data.push(newUser);

    // fs.writeFile(dataPath, JSON.stringify(data), (err) => {
    //   if (err) {
    //     console.log(err);
    //     return res.json({ status: "failed" });
    //   } else {
    //     console.log(body);
    //     return res.status(201).json({ status: "done" });
    //   }
    // });

    const result = await User.create({
      firstName: body?.firstName,
      lastName: body?.lastName,
      email: body?.email,
    });

    return res.json({
      status: 201,
      data: {
        ...result,
      },
    });
  });

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = req.params.id;
    const user = data.find((user) => user.id === id);

    return res.json(user);
  })
  .patch((req, res) => {
    //TODO
    const body = res.body;
    console.log(body);
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    //TODO
    return res.json({ status: "pending" });
  });

app.listen(PORT, () => {
  console.log(`server is start at ${PORT}`);
});
