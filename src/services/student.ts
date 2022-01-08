//this file will contain all the controller related to superAdmin
import databaseLayer from '../database'
const StudentModel = databaseLayer.StudentModel
const repository = databaseLayer.repository
import {HashPassword , comparePassword} from '../utils/passwordHash'
import generateToken from '../utils/generateJwtToken'
import { Channel } from 'amqplib'


type AuthType = {
    email: string
    password: string,
    role? : string
}

type ReturnType = {
    message?: string,
    data?: object
} 



type DeleteSuperAdminType = {
    id : string
}

// export const signUp = async (userInputs : AuthType , channel : Channel) : Promise<ReturnType | undefined> => {
//     const {email , password} = userInputs
//     try {
//         let superAdmin = await StudentModel.findOne({email:email});
//         if(superAdmin) {
//             // throw new Error('SuperAdmin already exists with this email')
//             return {message : "SuperAdmin already exists with this email"}
//         }
//         superAdmin = await StudentModel.create({
//             email : email,
//             password: password,
//             role : 'superAdmin'
//         })
         
//         //testing admin queue
//         //hash the password
//         let hashedPass = await HashPassword(password)
//         superAdmin.password = hashedPass
//         //save super admin in database
//         await superAdmin.save();
//         return {
//             message: "SuperAdmin Created.",
//             data : superAdmin
//         }
//     } catch (err) {
//         console.log('error in superAdmin signup',err)
//     }
// }

export const signin = async (userInputs : AuthType) : Promise<ReturnType | undefined> => {
   try {
       const {email , password} = userInputs;

       //login first find the superAdmin with the email
       const Student = await StudentModel.findOne({email : email});
       if(!Student) {
           return {message : "No Student with this email."}
       }
       //comparePassword
       let isPassMatched;
       if(Student.password !== undefined) {
         isPassMatched = await comparePassword(password , Student.password)
       }

       //if password not matched
       if(!isPassMatched) {
           return {message : "Information Incorrect."}
       }

       //jwt token
    //    console.log(typeof Student.id)
    //    console.log(typeof Student._id)
       const payload = {
           id : Student._id,
           role : Student.role as any
       }
       const token = generateToken(payload)

       return {message : "Login successfull." , data: {token , id : Student._id}}
       
   } catch (err) {
    console.log('error in Student signup',err)
   }
}

// export const updateStudent = async (userInputs : StudentType) : Promise<ReturnType | undefined> => {
//   try {
//       const {email , id , password , isActive , name , mobileNumber} = userInputs;
//       console.log('id' , id)
//       console.log(typeof id)
//       const Student = await StudentModel.findOne({_id: id});
//       if(!Student) {
//         return {message : "No Student found."}  
//       }
//       //update user context
//       const filter = {
//           id : id
//       }
      
//       const update = {
//           $set: {
//               isActive : isActive,
//               name : name,
//               mobileNumber : mobileNumber
//           },
//       }

//       const updateById = await repository.updateById(filter , update)
      
//       return {message : "Information updated" , data : updateById as any}
//   } catch (err) {
//       console.log('error in updatedStudent' , err)
//   }
// }

// export const deleteStudent = async (userInputs : DeleteStudentType) : Promise<ReturnType | undefined> => {
//      try {
//          const {id} = userInputs
//          const Student = await StudentModel.findOne({_id : id});
//          if(!Student) {
//              return {message : "No Student found"}
//          }

//          await Student.remove();

//          return {message : "Student deleted successfully."}
//      } catch (err) {
//          console.log('error in delete Student' , err)
//      }
// }