import mongoose from "mongoose";

const Assignment = new mongoose.Schema({
  Tid: { type: String, require: true },
  title: { type: String },
  description: { type: String },
  deadline: { type: Date },
  subject: { type: String },
});

const Assignment_Model = mongoose.model("Assignment", Assignment);
export default Assignment_Model;
