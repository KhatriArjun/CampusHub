import express from "express";
import { createServer } from "node:http";
import preprocessingRoutes from "./plagiarism/preprocessing.js";
import mongoose from "mongoose";
import "dotenv/config.js";
// import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import Student from "./Model/Student.js";
import Teacher from "./Model/Teacher.js";
import authRoutes from "./routes/auth.js";
import assignmentRoutes from "./routes/assignment.js";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";
import { Socket } from "node:dgram";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";

mongoose
  .connect(
    `mongodb+srv://campushub4u` +
      `:` +
      process.env.Password +
      `@cluster1.ozwg2bh.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((x) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error while connecting:", err);
  });

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretKey;

passport.use(
  new Strategy(opts, async function (jwt_payload, done) {
    try {
      let user;

      if (jwt_payload.userType == "Student") {
        user = await Student.findOne({ _id: jwt_payload.identifier });
      } else if (jwt_payload.userType == "Teacher") {
        user = await Teacher.findOne({ _id: jwt_payload.identifier });
      }

      if (user) {
        return done(null, user);
      } else {
        // Create a new user based on the JWT payload
        const newUser =
          jwt_payload.userType == "Student"
            ? new Student({
                id: jwt_payload.identifier,
              })
            : new Teacher({
                id: jwt_payload.identifier,
              });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return the newly created user
        return done(null, savedUser);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

const app = express();
const server = createServer(app);

// const io = new Server(server);
// //handling socket io
// io.on("connection", (socket) => {
//   socket.on("message", (message) => {
//     io.emit("message", message);
//   });
// });

// app.use(cors);
app.use(express.json());
// app.use(express.static(path.resolve("./public")));
app.use("/auth", authRoutes);
app.use("/preprocessing", preprocessingRoutes);
app.use("/assignment", assignmentRoutes);

// app.get("/", (req, res) => {
//   res.sendFile("/public/index.html");
// });
server.listen(process.env.PORT, () => {
  console.log("server started at port:", process.env.PORT);
});
