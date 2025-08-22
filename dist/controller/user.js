import { User } from "../model/user.js";
import { TryCatch } from "../middleware/error.js";
import { ApiResponse, ErrorHandler } from "../utils/utills-class.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { _id, name, email, gender, dob, photo } = req.body;
    const user = await User.findById(_id);
    if (user) {
        return res.status(200).json(new ApiResponse(200, "Welcome", user.name));
    }
    if (!_id || !name || !email || !gender || !dob || !photo) {
        return next(new ErrorHandler("Please Add All Field", 400));
    }
    const newUser = await User.create({
        _id,
        name,
        email,
        gender,
        dob: new Date(dob),
        photo,
    });
    res
        .status(201)
        .json(new ApiResponse(201, "User Created Succussfully ✅", newUser));
});
export const getallUser = TryCatch(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(new ApiResponse(200, "Users Fatched success", users));
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("invalid Id", 400));
    }
    res.status(200).json(new ApiResponse(200, "User Fatched", user));
});
export const delateUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("invalid Id", 400));
    }
    if (user.role == 'admin') {
        return next(new ErrorHandler("You Take Dengerous Opration", 401));
    }
    await user.deleteOne();
    res.status(200).json(new ApiResponse(200, "User delete successfully", user));
});
//# sourceMappingURL=user.js.map