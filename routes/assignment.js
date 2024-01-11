import express from "express";

import "dotenv/config";
let router = express.Router();
import multer from "multer";
import preprocess from "../plagiarism/preprocessing.js";
import passport from "passport";
import Teacher from "../Model/Teacher.js";
import Student from "../Model/Student.js";
import Assignment from "../Model/Assignment.js";
import TokenizeDB from "../Model/Tokenizedata.js";
import Submitted_Assignment_Model from "../Model/Submitted_Assignment.js";
import detectThreshold from "../plagiarism/kmpalgo.js";
import { unlink } from "node:fs";
import path from "path";
router.post(
  "/createAssignment",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { title, description, deadline, subject } = req.body;
    if (!title || !description || !deadline || !subject) {
      res.json({ err: "Insufficient data to create an assignment" });
    }

    const id = req.user.user._id;
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
      // const assignId = await Assignment.findOne({
      //   owner: user._id,
      //   subject: subject,
      // });
      // const update = await Student.updateMany({
      //   subject:"Web Technology"
      // }, {

      // })
      // console.log(assignId);

      res.json(newassignment);
    }
  }
);

router.get(
  "/teacher/assignmentDashboard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user.user._id;
    const assignment = await Assignment.find({ owner: id });

    res.json(assignment);
  }
);

router.get(
  "/student/getAssignment/:subject",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user.user._id;
    const sub = req.params.subject;
    const user = await Student.findOne({ _id: id });
    if (!user) {
      res.json({ err: "Only Students are allowed" });
    }
    const assignment = await Assignment.find({ subject: sub });
    if (assignment) {
      res.json(assignment);
    } else {
      res.json({ err: "Assignment not found" });
    }
  }
);

router.get(
  "/student/assignmentDashboard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user.user._id;
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
    return cb(null, `${req.user.user._id}.pdf`);
    // return cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

const plagiarism = async (req, res, next) => {
  const assignId = req.params.assignId;
  const filename = req.user.user._id; // filename is assigned as student id

  const currentdata = await preprocess(filename);
  console.log(currentdata);
  const __dirname = path.resolve();
  const absolutePath = path.resolve(__dirname, `./pdf/${filename}.pdf`);
  const checkdata = await TokenizeDB.findOne({
    assignment: assignId,
  });
  // console.log(checkdata);
  if (checkdata != null) {
    console.log("called");
    const length = checkdata.tokens.length;
    console.log("Line 138", length);
    let count = 0;
    for (let i = 0; i < length; i++) {
      const prevdata = checkdata.tokens[i];
      // console.log(prevdata);
      const threshold = detectThreshold(currentdata, prevdata);
      console.log("Line 144", threshold);
      if (threshold >= 30) {
        console.log("threshold");
        unlink(absolutePath, (err) => {
          if (err) throw err;
          console.log("file was deleted");
        });
        count++;
        break;

        // res.status(404).json({ message: "You have breached threshold" });
      }
    }
    if (count == 0) {
      req.currentdata = currentdata;
      req.absolutePath = absolutePath;
      next();
    } else {
      res.json({ err: "Threshold breached. Please submit again !!" });
    }
  } else {
    console.log("else called");
    console.log(assignId);
    const finaldata = await TokenizeDB.create({
      assignment: assignId,
      tokens: currentdata,
    });
    console.log(finaldata);

    const submit_data = await Submitted_Assignment_Model.create({
      assignment: assignId,
      submitted_students_detail: {
        student: filename,
        submitted_date: Date.now(),
        file_path: absolutePath,
      },
    });

    res.json({ message: "Successfully created and submitted" });
  }
};

router.post(
  "/submitAssignment/:assignId",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  plagiarism,

  async (req, res) => {
    const assignId = req.params.assignId;
    const currentdata = req.currentdata;
    const sid = req.user.user._id;

    console.log("update called");

    const checkdata = await Submitted_Assignment_Model.find({
      submitted_students_detail: { $elemMatch: { student: sid } },
    });
    // console.log(checkdata);
    // const size = checkdata[0].submitted_students_detail.length;

    // let poke = 0;
    // for (let i = 0; i < size; i++) {
    //   // console.log("value", checkdata[0].submitted_students_detail[i].student);
    //   // console.log("sid: ", sid);
    //   if (
    //     checkdata[0].submitted_students_detail[i].student.toString() ==
    //     sid.toString()
    //   ) {
    //     poke++;
    //   }
    // }
    // console.log("this is: ", poke);

    if (checkdata.length == 0) {
      const finaldata = await TokenizeDB.updateOne(
        {
          assignment: assignId,
        },
        {
          $push: { tokens: currentdata },
        },
        {
          new: true,
        }
      );
      const data = await Submitted_Assignment_Model.updateOne(
        {
          assignment: assignId,
        },
        {
          $push: {
            submitted_students_detail: {
              student: req.user.user._id,
              submitted_date: Date.now(),
              file_path: req.absolutePath,
            },
          },
        },
        {
          new: true,
        }
      );
      console.log("if called");
      res.send({ finaldata, data });
    } else {
      console.log("error cannot upload twice");
      res.json({ err: "Cannot upload twice" });
    }
  }
);

router.get(
  "/get_assignment_detail/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const subject_id = req.params.id;
    const assignment_detail = await Assignment.find({ _id: subject_id });
    if (assignment_detail.length !== 0) {
      res.json(assignment_detail);
    } else {
      res.json({ err: "cannot find assignment or id is not valid" });
    }
  }
);

router.get(
  "/get_list_students/:assignId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.params.assignId;
    console.log(id);
    const list = await Submitted_Assignment_Model.findOne({ assignment: id });
    console.log(list);
    res.json(list.submitted_students_detail);
  }
);

export default router;
