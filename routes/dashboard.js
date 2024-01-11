import express from "express";

import "dotenv/config";
import passport from "passport";
let router = express.Router();
import Assignment_Model from "../Model/Assignment.js";
import student_Model from "../Model/Student.js";
import Teacher_Modal from "../Model/Teacher.js";
router.get(
  "/home",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const type = req.user.type;
    const id = req.user.user._id;
    if (type == "Teacher") {
      const get_teacher_name = await Teacher_Modal.findOne({_id : id} , {_id : 0, __v: 0, username : 0, password : 0,email : 0, phone : 0, address : 0,id : 0})
      const teacher = get_teacher_name
      const data = await Assignment_Model.find({
        owner: id,
      });
      // const data = recent_assignment.reverse().slice(0,4)
      res.json({data , teacher});
    }
    
    else if (type == "Student") {
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
