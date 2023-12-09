import express from "express";

import "dotenv/config";
let router = express.Router();

import passport from "passport";
import Teacher from "../Model/Teacher.js";
import Student from "../Model/Student.js";
import Assignment from "../Model/Assignment.js";
import Assignment_Model from "../Model/Assignment.js";

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
    }
    const newData = {
      Tid: user.id,
      title,
      description,
      deadline,
      subject,
    };
    const newassignment = await Assignment_Model.create(newData);

    res.status(201).json(newassignment);
  }
);

router.get(
  "/getAssignment/:subject",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user._id;
    const sub = req.params.subject;
    const user = await Student.findOne({ _id: id });
    if (!user) {
      res.status(501).json({ err: "Only Students are allowed" });
    }
    const assignment = await Assignment.findOne({ subject: sub });
    if (assignment) {
      res.status(201).json(assignment);
    } else {
      res.status(404).json({ err: "Assignment not found" });
    }
  }
);

export default router;
