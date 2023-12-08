import mongoose from "mongoose";

const Teacher = new mongoose.Schema({
  id: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  t_name: { type: String },
  phone: { type: String },
  address: { type: String },
  subject: { type: [String], require: true },
  student: { type: mongoose.Types.ObjectId, ref: "Student" },
});

const Teacher_Modal = mongoose.model("Teacher", Teacher);

export default Teacher_Modal;
