import {prop , getModelForClass} from '@typegoose/typegoose'



type AddressType = {
    street?: string
    pinCode?: number
    landmark?:string
    city?: string
    state?: string
}



class Student {
    @prop({type : () => String})
    public name?: string;

    @prop({ type: () => String})
    public email?: string;

    @prop({type: () => String}) 
    public password? : string;

    @prop({type: () => Boolean , default : false})
    public isActive? : boolean;

    @prop({type : () => String})
    public mobileNumber?: string

    @prop({type: () => String , default : 'student'})
    public role?: string

    @prop({type : () => String})
    public instituteName?: string

    @prop({type : () => String})
    public address?: string

    @prop({type : () => Date})
    public joinDate? : Date

    @prop({type : () =>  Date}) 
    public dob? : Date
    
    @prop({type : () => String})
    public parentNumber?: string

    @prop({type : () => Number})
    public fees?: number

    @prop({type : () => String})
    public instituteId?: string

    // @prop({type: () => [String]})
    // public subjectTags? : string[]
}

const StudentModel = getModelForClass(Student);
export default StudentModel
