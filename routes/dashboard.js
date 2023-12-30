import express from "express";

import "dotenv/config";
import passport from "passport";
let router = express.Router();
import Assignment_Model from "../Model/Assignment.js";
import student_Model from "../Model/Student.js";

router.get(
  "/home",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const type = req.user.type;
    const id = req.user.user._id;
    if (type == "Teacher") {
      const data = await Assignment_Model.findOne({
        owner: id,
      });
      res.json(data);
    } else if (type == "Student") {
      const subdata = await student_Model.findOne({
        _id: id,
      });
      const subjectDB = subdata.subjects;
      const data = await Assignment_Model.find({
        subject: { $in: subjectDB },
      });
      res.json(data);
    }
  }
);
export default router;
