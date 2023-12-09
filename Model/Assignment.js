import mongoose from 'mongoose'


const Assignment = new mongoose.Schema({
    title : {type : String},
    description : {type : String},
    deadline : {type : Date},
    subject : {type : String},
    submitted_students : [{type : mongoose.Type.ObjectId,ref : "Student"}]
})

export default Assignment_Model = mongoose.model("Assignment" , Assignment)