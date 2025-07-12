class ErrorHandler extends Error {
  constructor(public message: string, public statuscode: number = 500) {
    super(message);
    this.statuscode = statuscode;
  }
}

class ApiResponse {
  success: boolean;
  constructor(
    public statusCode: number = 200,
    public message: string,
    public data: string | unknown = {}
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = true;
  }
}

export { ErrorHandler, ApiResponse };
