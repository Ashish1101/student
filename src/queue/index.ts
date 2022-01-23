import { Channel , ConsumeMessage} from "amqplib";
import databaseLayer from '../database'
const StudentModel = databaseLayer.StudentModel
import {FANOUT_STUDENT_BULK_UPLOAD_STUDENT_QUEUE , CREATE_STUDENT_QUEUE} from './types'
import {HashPassword} from '../utils/passwordHash'
import randomPassword from "../utils/randomPassword";
import Mail from '../utils/sendMail'
import {parse} from 'node-html-parser'
import mailTemplate from "../utils/mailTemplate";

// type StudentType = {
//   name : string
//   email : string
//   mobileNumber: number
//   address : string
//   joinDate : string
//   fees : number
//   instituteName : string
//   dob : Date
//   parentNumber : number
//   password : string
// }


export default (channel : Channel) => {
  //CREATE A NEW STUDENT
  //FANOUT_STUDENT_BULK_UPLOAD_STUDENT_QUEUE

  channel.consume(FANOUT_STUDENT_BULK_UPLOAD_STUDENT_QUEUE , async (msg : ConsumeMessage | null) => {
        const MSG : any = msg?.content
        // console.log('Student data' , JSON.parse(MSG.toString()));
        const studentData = JSON.parse(MSG.toString())
        const data = studentData.data
        console.log('--------------data -------------------------' , data)
        StudentModel.insertMany(data)
        .then(item => {
           console.log('new Item' , item)
        }).catch(err => {
          console.log('err' , err)
        })
      
  } , {noAck : true})

  //Single Student Creation
  channel.consume(CREATE_STUDENT_QUEUE , async (msg : ConsumeMessage | null ) => {
       const MSG : any = msg?.content;
       const studentData = JSON.parse(MSG.toString());
       console.log('studentData ' , studentData)
       const {email , mobileNumber , name , fees , parentNumber , joinDate , dob , address, id} = studentData
       let student = await StudentModel.findOne({email : email , instituteId : id})
       //we have to a rpc here (Remote Procedure call) to tell the admin that user already exists
       //or we can check in admin model students email before inserting
       console.log('--------------------student-------------------', student);
       if(student) {
          console.log('student already exists');
          return
       }

       //generate a random password for the user
       let randomPass = randomPassword(8);
       
       const root = parse(mailTemplate({email , password : randomPass , name}))
       let option = {
         from:'postmaster@sandboxf4f02702678d4ad49db5699563946f44.mailgun.org',
         to: studentData.email,
         subject : "Login Credentials For Coaching",
         html:  root.innerHTML
       }
       //triggering a mail to the student
       Mail(option)
              
       //send unHashed password to user then hash the password and save it to
       //the datbase
       let hashedPass = await HashPassword(randomPass)

       let newStudent = new StudentModel({
         email : email,
         mobileNumber : mobileNumber,
         fees : fees,
         name : name,
         parentNumber: parentNumber,
         joinDate : joinDate,
         dob : dob,
         address : address,
         instituteId : id,
         isActive : true,
         password  : hashedPass
       })
       console.log('user created' , newStudent)
       await newStudent.save()
  } , {noAck : true})
  
}