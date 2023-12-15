import express from "express";

import "dotenv/config";
let router = express.Router();

import passport from "passport";
import Teacher from "../Model/Teacher.js";
import Student from "../Model/Student.js";
import Assignment from "../Model/Assignment.js";

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

router.post(
  "/submitAssignment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const assignment = req.body;
  }
);

export default router;
