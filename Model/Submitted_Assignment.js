import mongoose from 'mongoose'


const Submitted_Assignment = new mongoose.Schema({
    assignment : {type : mongoose.Types.ObjectId , ref : "Assignment"},
    submitted_students : [{type : mongoose.Types.ObjectId,ref : "Student"}]
})

 const Submitted_Assignment_Modal = mongoose.model("Submitted_Assignment" , Submitted_Assignment)
 export default Submitted_Assignment_Modal