
class ErrorHandler extends Error {
  constructor(errorType = {}, data=undefined, validations=[]) {
    
    super();
    this.type = errorType.type;
    this.message = errorType.message;
  
    this.data = data;
    this.statusCode = errorType.defaultStatusCode;
    this.validations = validations;
  }
}

module.exports = {
  ErrorHandler,
}