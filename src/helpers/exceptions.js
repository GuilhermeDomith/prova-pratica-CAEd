
class ErrorHandler extends Error {
  constructor(errorType, statusCode = undefined, data = undefined) {
    super();
    this.data = data;
    this.statusCode = statusCode;
    this.type = errorType.type;
    this.message = errorType.message;
  }
}

module.exports = {
  ErrorHandler,
}