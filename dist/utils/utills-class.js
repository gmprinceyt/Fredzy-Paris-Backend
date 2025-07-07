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
export { ErrorHandler };
