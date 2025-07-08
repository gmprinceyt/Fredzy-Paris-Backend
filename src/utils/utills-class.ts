class ErrorHandler extends Error {
    constructor(public message:string, public statuscode:number = 500, ){
        super(message);
        this.statuscode = statuscode;
    };
};

class ApiResponse {
   constructor(public statusCode:number,public message:string , public data:string | unknown = null ){
    this.statusCode = statusCode;
    this.message = message;
    this.data = data
   }
}

export {ErrorHandler, ApiResponse};