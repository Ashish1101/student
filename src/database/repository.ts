import AdminModel from "./models/Student"

type FilterType = {
    id : string
}

type Update = object

export default {
    updateById : async (filter : FilterType, update : Update) => {
        try {
            const findById = await AdminModel.findOneAndUpdate(filter , update);
            return findById
        } catch (err) {
            console.log('error in updateByID')
        }
    }
}