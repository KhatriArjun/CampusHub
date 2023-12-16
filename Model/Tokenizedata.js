import mongoose from "mongoose";

const TokenizeData = new mongoose.Schema({
  assignmentof: [
    {
      assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },

      tokens: { type: [String] },

      owner: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    },
  ],
});

const TokenizeData_Model = mongoose.model("TokenizeData", TokenizeData);

export default TokenizeData_Model;
