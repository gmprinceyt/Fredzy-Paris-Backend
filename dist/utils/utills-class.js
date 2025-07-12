class ErrorHandler extends Error {
    constructor(message, statuscode = 500) {
        super(message);
        this.message = message;
        this.statuscode = statuscode;
        this.statuscode = statuscode;
    }
}
class ApiResponse {
    constructor(statusCode = 200, message, data = {}) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true;
    }
}
export { ErrorHandler, ApiResponse };
