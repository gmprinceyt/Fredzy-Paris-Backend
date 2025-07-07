import { User } from "../model/user.js";
import { TryCatch } from "../middleware/error.js";
export const newUser = TryCatch(async (req, res) => {
    const { _id, name, email, gender, dob, photo } = req.body;
    const NewUser = await User.create({
        _id,
        name,
        email,
        gender,
        dob: new Date(dob),
        photo,
    });
    res.status(201).json({
        success: true,
        message: `New User Created `,
        data: `${NewUser}`
    });
});
