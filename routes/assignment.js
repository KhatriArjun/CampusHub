import express from "express";

import "dotenv/config";
let router = express.Router();
import multer from "multer";
import plagiarism from "../plagiarism/preprocessing.js";
import passport from "passport";
import Teacher from "../Model/Teacher.js";
import Student from "../Model/Student.js";
import Assignment from "../Model/Assignment.js";
import TokenizeDB from "../Model/Tokenizedata.js";
import detectThreshold from "../plagiarism/kmpalgo.js";

router.post(
  "/createAssignment",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { title, description, deadline, subject } = req.body;
    if (!title || !description || !deadline || !subject) {
      res
        .status(404)
        .json({ error: "Insufficient data to create an assignment" });
    }

    const id = req.user._id;
    const user = await Teacher.findOne({ _id: id });

    if (!user) {
      res.status(501).json({ err: "Only Teachers are allowed!!" });
    } else {
      const newData = {
        Tid: user.id,
        title,
        description,
        deadline,
        subject,
        owner: user._id,
      };
      const newassignment = await Assignment.create(newData);

      res.status(201).json(newassignment);
    }
  }
);

router.get(
  "/teacher/assignmentDashboard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user._id;
    const assignment = await Assignment.find({ owner: id });

    res.json(assignment);
  }
);

router.get(
  "/student/getAssignment/:subject",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user._id;
    const sub = req.params.subject;
    const user = await Student.findOne({ _id: id });
    if (!user) {
      res.status(501).json({ err: "Only Students are allowed" });
    }
    const assignment = await Assignment.find({ subject: sub });
    if (assignment) {
      res.status(201).json(assignment);
    } else {
      res.status(404).json({ err: "Assignment not found" });
    }
  }
);

router.get(
  "/student/assignmentDashboard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user._id;
    const assign = await Assignment.find();
    const data = await Student.findOne({ _id: id });
    const newdata = assign.filter((value) => {
      if (data.subjects.includes(value.subject)) {
        return value;
      }
    });
    res.json(newdata);
  }
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("this is req from destination: ", req);

    return cb(null, "./pdf");
  },
  filename: function (req, file, cb) {
    // console.log("this is req from filename: ", req);

    // return cb(null, `${req.user._id}_${file.originalname}`);
    return cb(null, `${req.user._id}.pdf`);
    // return cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

const middleware = async (req, res, next) => {
  console.log("middleware called");
  const filename = req.user._id;
  const currentdata = await plagiarism(filename);
  const checkdata = await TokenizeDB.findOne({
    "assignmentof.assignment": "657b2ce46a1d85a5c3c8aafc",
  });
  console.log(checkdata);
  if (checkdata) {
    const prevdata = checkdata.assignmentof[0].tokens;
    const threshold = detectThreshold(currentdata, prevdata);
    console.log(threshold);
  } else {
    const finaldata = await TokenizeDB.create({
      assignmentof: {
        assignment: "657b2ce46a1d85a5c3c8aafc",
        tokens: currentdata,
        owner: filename,
      },
    });

    console.log(finaldata);
  }
  next();
};

router.post(
  "/submitAssignment",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  middleware,

  async (req, res) => {
    // console.log("called");
    const assignment = req.body;
    const filename = req.file;
    // console.log("this is from body: ", assignment);
    // console.log("this is from file: ", filename);
  }
);

export default router;
