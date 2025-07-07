class ErrorHandler extends Error {
    constructor(public message:string, public statuscode:number = 500, ){
        super(message);
        this.statuscode = statuscode;
    };
};

export {ErrorHandler};