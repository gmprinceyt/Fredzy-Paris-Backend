// Error Handler 
export const ErrorMiddleware = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    const message = err.message || "Internal Server Error";
    const statuscode = err.statuscode || 500;
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
