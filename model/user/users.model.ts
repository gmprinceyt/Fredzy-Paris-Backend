import mongoose  from "mongoose";

const usersSchema = new mongoose.Schema({
    role_name: String
},{timestamps: true});

const Users = mongoose.model('Users', usersSchema);
export default Users;