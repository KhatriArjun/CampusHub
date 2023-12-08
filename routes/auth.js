import express from "express";
let router = express.Router();
import getToken from "../utils/helper.js";
import bcrypt from "bcrypt";
import DB from "../SCHOOLDB/schoolDB.json" assert { type: "json" };

import TeacherModel from "../Model/Teacher.js";
import StudentModel from "../Model/Student.js";
import OtpModel from "../Model/Otp.js";

import {
  sendEmail,
  otpAuthenticate,
  otpVerify,
} from "../utils/otpVerification.js";

const createNewUser = async () => {};

router.post("/register/teacher", async (req, res) => {
  const { Tid, username, password } = req.body;
  global.id = Tid;
  global.username = username;
  global.password = password;

  const data = DB.Teachers.filter((value) => {
    if (value.id == Tid) {
      return value;
    }
  });
  if (!data) {
    res.status(400).json({ error: "Invalid Id" });
  }

  const { name, email, phone, subject, address } = data[0];
  const teacher = await TeacherModel.findOne({ id: Tid });
  if (teacher) {
    return res
      .status(401)
      .json({ error: "A teacher with same id already exists" });
  }

  //OTP verification
  await sendEmail(email);

  return res.status(200).json({ message: "Successfully verified !!" });
});

router.post("/register/otp", async (req, res) => {
  const { value } = req.body;

  if (global.id[0] == "T") {
    const data = DB.Teachers.filter((value) => {
      if (value.id == global.id) {
        return value;
      }
    });
    if (!data) {
      res.status(400).json({ error: "Invalid Id" });
    }

    const { name, email, phone, subject, address, id } = data[0];

    const user = await OtpModel.findOne({ value: value });
    if (!(value == user.value)) {
      res.status(403).json({ err: "Otp doesnot matches!!" });
    }
    const del = await OtpModel.findOneAndDelete({ value: value });

    const hashedPassword = await bcrypt.hash(global.password, 10);
    const newUsername = global.username;
    console.log(newUsername);
    const newTeacherData = {
      id: id,
      username: newUsername,
      t_name: name,
      address,
      phone,
      subject,
      password: hashedPassword,
      email,
    };

    const TeacherData = await TeacherModel.create(newTeacherData);
    const token = await getToken(email, TeacherData);
    const userToReturn = { ...TeacherData.toJSON(), token };
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
  } else {
    const data = DB.Students.filter((value) => {
      if (value.id == global.id) {
        return value;
      }
    });
    if (!data) {
      res.status(400).json({ error: "Invalid Id" });
    }

    const { name, email, phone, batch, address, id } = data[0];

    const user = await OtpModel.findOne({ value: value });
    if (!(value == user.value)) {
      res.status(403).json({ err: "Otp doesnot matches!!" });
    }
    const del = await OtpModel.findOneAndDelete({ value: value });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudentData = {
      id: id,
      username,
      s_name: name,
      address,

      batch,
      password: hashedPassword,
      email,
    };

    const StudentData = await StudentModel.create(newStudentData);
    const token = await getToken(email, StudentData);
    const userToReturn = { ...StudentData.toJSON(), token };
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
  }
});

router.post("/register/student", async (req, res) => {
  const { Sid, username, password } = req.body;
  global.id = Sid;
  global.username = username;
  global.password = password;

  const data = DB.Students.filter((value) => {
    if (value.id == Sid) {
      return value;
    }
  });
  if (!data) {
    res.status(400).json({ error: "Invalid Id" });
  }
  const { name, email, phone, batch, address } = data[0];
  const student = await StudentModel.findOne({ id: Sid });
  if (student) {
    return res
      .status(401)
      .json({ error: "A student with same id already exists" });
  }

  //OTP verification
  await sendEmail(email);

  return res.status(200).json({ message: "Successfully verified !!" });
});

router.post("/login/teacher", async (req, res) => {
  const { username, password } = req.body;
  const user = await TeacherModel.findOne({ username: username });
  if (!user) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  global.id = user.id;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  await sendEmail(user.email);

  res.json({ message: "Successful password login!!" });
});

router.post("/login/student", async (req, res) => {
  const { username, password } = req.body;
  const user = await StudentModel.findOne({ username: username });
  if (!user) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  global.id = user.id;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  await sendEmail(user.email);

  res.json({ message: "Successful password login!!" });
});

router.post("/login/otp", async (req, res) => {
  const { value } = req.body;

  const user = await OtpModel.findOne({ value: value });
  if (!(value == user.value)) {
    res.status(403).json({ err: "Otp doesnot matches!!" });
  }
  const del = await OtpModel.findOneAndDelete({ value: value });
  res.status(201).json({ message: "Congratulations !!" });
});

export default router;
