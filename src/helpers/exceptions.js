
class ErrorHandler extends Error {
  constructor(
      errorType = {}, 
      statusCode = null,
      data = null,
      validations = []) {
    
    super();
    this.type = errorType.type;
    this.message = errorType.message;

    this.data = data;
    this.statusCode = statusCode || errorType.defaultStatusCode;
    this.validations = validations;
  }
}

module.exports = {
  ErrorHandler,
}