// Error Handler 
export const ErrorMiddleware = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    const message = err.message || "Internal Server Error";
    const statuscode = err.statuscode || 500;
    if (err.name === "CastError") {
        res.status(statuscode).json({
            err: err.message,
            success: false,
            massage: "CastError Error Popped"
        });
        return;
    }
    res.status(statuscode).json({
        message,
        success: false,
        err,
    });
};
// Async Handler 
export const TryCatch = (fn) => {
    return async function (req, res, next) {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
