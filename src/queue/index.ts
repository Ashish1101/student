import { Channel , ConsumeMessage} from "amqplib";
import databaseLayer from '../database'
const StudentModel = databaseLayer.StudentModel
import {FANOUT_STUDENT_BULK_UPLOAD_STUDENT_QUEUE} from './types'

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
   
}