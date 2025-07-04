import mongoose from "mongoose";


const UserRoleSchema = new mongoose.Schema({
    
}, {timestamps: true})
const UserRole = mongoose.model('UserRole', UserRoleSchema);
export default UserRole;