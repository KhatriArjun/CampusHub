import express from "express";

import "dotenv/config";
import passport from "passport";
let router = express.Router();
import Group from "../Model/Group.js";
import Teacher_Modal from "../Model/Teacher.js";
import Student_Model from "../Model/Student.js";
import groupchatmsg from "../Model/Group_chat_messages.js";
import Student_Modal from "../Model/Student.js";

router.post(
  "/creategroup",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { subjectName, groupName } = req.body;
    const type = req.user.type;
    console.log("this is id",req.user.user._id)
    const id = req.user.user._id;
    console.log("this is type",type)
    if (type == "Teacher") {

      const data = await Teacher_Modal.findOne({ _id: id });
        if (!data) {
          res.json({ err: "Teacher is not found" });
        }
        else{
          const subject = data.subject.includes(subjectName);

        if(subject === false){
          res.json({ msg: "You are not allowed to create this group" });
        }else{
          const checkgroup = await Group.findOne({ subject: subjectName });
          console.log("check group",checkgroup)
    
          if (checkgroup) {
            res.json({ err: "Already exist" });
          }else{
            const list = await Student_Model.find({ subjects: subjectName });
            const students = list.map((student) => student._id.toString());
    
            const newdata = {
              subject: subjectName,
              name: groupName,
              teacher: id,
              collaborators: students,
            };
            const result = await Group.create(newdata);
            console.log("This from result group created",result)
            res.json(result);
          }
        }
        }

      // const checkgroup = await Group.findOne({ subject: subjectName });
      // console.log("check group",checkgroup)

      // if (checkgroup) {
      //   res.json({ err: "Already exist" });
      // } 
      // else {
      //   const data = await Teacher_Modal.findOne({ _id: id });
      //   if (!data) {
      //     res.json({ err: "Teacher is not found" });
      //   }

      //   const subject = data.subject.includes(subjectName);

      //   if(subject === false){
      //     res.json({ msg: "You are not allowed to create this group" });
      //   }

      //   else{
      //     const list = await Student_Model.find({ subjects: subjectName });
      //     const students = list.map((student) => student._id.toString());
  
      //     const newdata = {
      //       subject: subjectName,
      //       name: groupName,
      //       teacher: id,
      //       collaborators: students,
      //     };
      //     const result = await Group.create(newdata);
      //     console.log("This from result group created",result)
      //     res.json(result);
      //   }
        
      // }
    } else {
      res.json({ err: "Not Allowed" });
    }
  }
);

router.get(
  "/group",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const type = req.user.type;
    const id = req.user.user._id;
    
    if (type == "Teacher") {
      const groups = await Group.find({ teacher: id });
      res.status(200).json(groups);
    } else if (type == "Student") {
      const groups = await Group.find({ collaborators: id });
      res.status(200).json(groups);
    } else {
      res.json({ err: "Invalid" });
    }
  }
);

router.get("/get_all_groups",
     async (req , res) => {
      //  const student = await Student_Model.find();
      //  const group = await Group.find()
      //  res.json({group , student})
      //  if((group.length) !== 0){
      //   res.json(group)
      //  }else{
      //   res.json({msg : "aaa"})
      //  }
      const check_chat = await Group.findOne({subject : "Microprocessor"})
      const id = check_chat._id

      
      const group_chat_messages = await groupchatmsg.findOne({group : id} , {group : 0 , _id : 0 , __v : 0})

      res.json(group_chat_messages)
       

})

router.get("/getteacher" ,async (req , res) => {
  const data = await Teacher_Modal.findOne({_id : "659bb9dc920177f731a30acd"});
  // let subject = "POMs"
  // if(data.subject.includes(subject)){
  //   res.json({msg : "u can create "})
  // }
  // else{
  //   res.json({msg : "u cannot  create "})
  // }
  res.json(data)
})

router.post(
  "/savemessage",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { subjectName, message } = req.body;
    const group = await Group.findOne({ subject: subjectName });
    console.log("the group message is" , group)

    const id = req.user.user._id;
    const type = req.user.type;
    const findmsg = await groupchatmsg.findOne({ group: group._id });
    if (findmsg) {
      const result = await groupchatmsg.findOneAndUpdate(
        {group : group._id},
        {$push: {
          messages: {
            from: id,
            model_type: type,
            message,
          },
        }},
        {new: true},
      );
      const new_added_data = result.messages[result.messages.length - 1]
      console.log("newly added data is " , new_added_data)
      res.json(new_added_data);
    } else {
      const result = await groupchatmsg.create({
        group: group._id,

        messages: {
          from: id,
          model_type: type,
          message,
        },
      });
      res.json(result);
    }
  }
);

router.post(
  "/getmessage",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user.user._id;
    console.log("this is use  id  in get message router " , id)
    const { subjectName } = req.body;
    const group = await Group.findOne({ subject: subjectName });

    
    const chatmsg = await groupchatmsg.findOne({ group: group._id } , {_id : 0, __v : 0});
    if(chatmsg != null){
      const filtered_chat_messages =  chatmsg.messages.map((message) => {
        const temp_message = {}
        console.log(`check id is ${message.from} == ${id}` ,((message.from).toString() === id.toString()))
          if ((message.from).toString() === id.toString()){
            temp_message.self = true
          }else{
            temp_message.self = false
          }
          temp_message.message = message.message
          return temp_message
        })
        res.json(filtered_chat_messages)
    }
   
  }
);

export default router;
