import express from "express";
import { createServer } from "node:http";
import preprocessingRoutes from "./plagiarism/preprocessing.js";
import mongoose from "mongoose";
import "dotenv/config.js";
import { v4 as uuidv4 } from 'uuid';
// import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import Student from "./Model/Student.js";
import Teacher from "./Model/Teacher.js";
import authRoutes from "./routes/auth.js";
import assignmentRoutes from "./routes/assignment.js";
import subjectRoutes from "./routes/subject.js";
import settingRoutes from "./routes/setting.js";
import dashboardRoutes from "./routes/dashboard.js";
import path from "path";
import messageRoutes from "./routes/message.js";
import json from "jsonwebtoken"
import cors from "cors";

import { Server } from "socket.io";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
// import { socketConnection } from "./utils/start.js";
const app = express();
let universal_user
app.use(cors({}));


mongoose
  .connect(
    `mongodb+srv://campushub4u:${process.env.Password}@cluster1.ozwg2bh.mongodb.net/?retryWrites=true&w=majority`
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
        return done(null, { user: user, type: jwt_payload.userType });
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

// const server = createServer(app);
// socketConnection(server);
const received_message_data = {}
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173/teacher/dashboard",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const map_current_users = new Map()

// io.use((socket , next) => {
//   const user_uuid = uuidv4()
//   console.log("the uuid is" , user_uuid)
//   const token = socket.handshake.auth.token
//   console.log("own token is server" , token)
//   const id = fetch_user_id(token)
//   if(map_current_users.get(id) == undefined){
//     map_current_users.set(id , user_uuid)
//   }
//   next()
// })


const fetch_user_id = (token) =>{
  let id = null
  json.verify(token, process.env.secretKey, function(err, decoded) {
    if(decoded && decoded.identifier){
      console.log("decoded on io middleware" , decoded)
       id = decoded.identifier
    }
  });
  return id
}

io.on("connection", (socket) => {

  console.log("User connected", socket.id);

  socket.on("join_room", (data) => {
    console.log("joined to room" , data)
    socket.join(data);
    console.log("user with id:", socket.id, "connected in a room:", data);
  });

  socket.on("send_message", (data) => {


    // received_message_data.message = data.message
    console.log("the data is ",data);
    // console.log("the message to send is ", received_message_data)
    socket.to(data.subjectName).emit("receive_message", data);
 

  })
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
})
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use(express.json());
// app.use(express.static(path.resolve("./public")));
app.use("/auth", authRoutes);
app.use("/preprocessing", preprocessingRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/subject", subjectRoutes);
app.use("/setting", settingRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/message", messageRoutes);

// app.get("/", (req, res) => {
//   res.sendFile("/public/index.html");
// });
server.listen(process.env.PORT, () => {
  console.log("server started at port:", process.env.PORT);
});
