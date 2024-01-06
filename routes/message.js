import express from "express";

import "dotenv/config";
import passport from "passport";
let router = express.Router();
import Group from "../Model/Group.js";
import Teacher_Modal from "../Model/Teacher.js";
import Student_Model from "../Model/Student.js";
import groupchatmsg from "../Model/Group_chat_messages.js";

router.post(
  "/creategroup",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { subjectName, groupName } = req.body;
    const type = req.user.type;
    const id = req.user.user._id;
    if (type == "Teacher") {
      const checkgroup = await Group.findOne({ subject: subjectName });
      if (checkgroup) {
        res.status(400).json({ err: "Already exist" });
      } else {
        const data = await Teacher_Modal.findOne({ _id: id });
        if (!data) {
          res.status(400).json({ err: "Not found" });
        }
        const subject = data.subject.includes(subjectName);
        const list = await Student_Model.find({ subjects: subjectName });
        const students = list.map((student) => student._id.toString());

        const newdata = {
          subject: subjectName,
          name: groupName,
          teacher: id,
          collaborators: students,
        };
        const result = await Group.create(newdata);
        res.json(result);
      }
    } else {
      res.status(400).json({ err: "Not Allowed" });
    }
  }
);

router.get(
  "/group",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const type = req.user.type;
    const id = req.user.user._id;
    if (type == "Teacher") {
      const groups = await Group.find({ teacher: id });
      res.status(200).json(groups);
    } else if (type == "Student") {
      const groups = await Group.find({ collaborators: id });
      res.status(200).json(groups);
    } else {
      res.status(400).json({ err: "Invalid" });
    }
  }
);

router.post(
  "/savemessage",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { subjectName, message } = req.body;
    const group = await Group.findOne({ subject: subjectName });

    const id = req.user.user._id;
    const type = req.user.type;
    const findmsg = await groupchatmsg.findOne({ group: group._id });
    if (findmsg) {
      const result = await groupchatmsg.findOneAndUpdate({
        group: group._id,
        $push: {
          messages: {
            from: id,
            model_type: type,
            message,
          },
        },
        new: true,
      });
      res.json(result);
    } else {
      const result = await groupchatmsg.create({
        group: group._id,

        messages: {
          from: id,
          model_type: type,
          message,
        },
      });
      res.json(result);
    }
  }
);

router.post(
  "/getmessage",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user.user._id;
    const { subjectName } = req.body;
    const group = await Group.findOne({ subject: subjectName });

    const chatmsg = await groupchatmsg.findOne({ group: group._id });
    res.json(chatmsg);
  }
);

export default router;
