class ErrorHandler extends Error {
    constructor(message, statuscode = 500) {
        super(message);
        this.message = message;
        this.statuscode = statuscode;
        this.statuscode = statuscode;
    }
    ;
}
;
class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
export { ErrorHandler, ApiResponse };
