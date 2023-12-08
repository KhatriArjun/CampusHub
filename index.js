import express from "express";
import preprocessingRoutes from "./plagiarism/preprocessing.js";
import mongoose from "mongoose";
import "dotenv/config.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import Student from "./Model/Student.js";
import Teacher from "./Model/Teacher.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";

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
  new JwtStrategy(opts, async function (jwt_payload, done) {
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
// app.use(cors);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/preprocessing", preprocessingRoutes);
app.listen(process.env.PORT, () => {
  console.log("server started at port:", process.env.PORT);
});
