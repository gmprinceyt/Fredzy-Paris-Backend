import { User } from "../model/user.js";
import { ErrorHandler } from "../utils/utills-class.js";
import { TryCatch } from "./error.js";
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        return next(new ErrorHandler('only admin access route', 400));
    }
    ;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("invailid ID", 404));
    }
    if (user.role !== 'admin') {
        return next(new ErrorHandler("Unauthorized", 401));
    }
    ;
    next();
});
//# sourceMappingURL=auth.js.map