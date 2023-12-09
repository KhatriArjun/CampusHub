import mongoose from 'mongoose'


const Assignment = new mongoose.Schema({
    title : {type : String},
    description : {type : String},
    deadline : {type : Date},
    subject : {type : String}
})

export default Assignment_Model = mongoose.model("Assignment" , Assignment)