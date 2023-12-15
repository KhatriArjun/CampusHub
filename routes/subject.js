import express from "express";
let router = express.Router();

import studentModel from "../Model/Student.js";
import assignmentModel from "../Model/Assignment.js";
import pkg from "body-parser";
import passport from "passport";
const { json } = pkg;

router.get(
  "/mysubjectDashboard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user._id;
    // const keys = Object.keys(subDB);

    // const now = new NepaliDate();
    // const formattedDate = now.format("YYYY-MM-DD");

    // const year = formattedDate.split("-");

    // const cal1 = parseInt(year[0]);

    // const dbdate = await studentModel.findOne({ _id: id });

    // const caldbdate = parseInt(dbdate.batch);
    // const diff = cal1 - caldbdate;
    // if (diff == 1) {
    //   const month = year[1];
    //   if (month < 6) {
    //     const sub = subDB[keys[0]];
    //     res.status(201).json({ sub });
    //   } else {
    //     const sub = subDB[keys[1]];
    //     res.status(201).json({ sub });
    //   }
    // } else if (diff == 2) {
    //   const month = year[1];
    //   if (month < 6) {
    //     const sub = subDB[keys[2]];
    //     res.status(201).json({ sub });
    //   } else {
    //     const sub = subDB[keys[3]];
    //     res.status(201).json({ sub });
    //   }
    // } else if (diff == 3) {
    //   const month = year[1];
    //   if (month < 6) {
    //     const sub = subDB[keys[4]];
    //     res.status(201).json({ sub });
    //   } else {
    //     const sub = subDB[keys[5]];
    //     res.status(201).json({ sub });
    //   }
    // } else if (diff == 4) {
    //   const month = year[1];
    //   if (month < 6) {
    //     const sub = subDB[keys[6]];
    //     res.status(201).json({ sub });
    //   } else {
    //     const sub = subDB[keys[7]];
    //     res.status(201).json({ sub });
    //   }
    // } else {
    //   console.log("you have graduated");
    // }

    const subject = await studentModel.findOne({ _id: id });

    res.json(subject.subjects);
  }
);

export default router;
