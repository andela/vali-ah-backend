/**
 * base error class for application
 *
 * @class
 *
 * @extends Error
 */
export class ApplicationError extends Error {
  /**
   * Create a Notification.
   * @description initialises the service
   *
   * @param {number} status - status code;
   * @param {string} message - Error message
   * @param {Array} errors - an array of errors
   */
  constructor(status, message = 'An Error Occured', errors = []) {
    super(message);
    this.status = status || 500;
    this.message = message;
    this.errors = errors;
  }
}

/**
 * Class for not found error
 *
 * @class
 *
 * @extends ApplicationError
 */
export class NotFoundError extends ApplicationError {
  /**
   * Create a Notification.
   * @description initialises the service
   *
   * @param {string} message - Error message
   */
  constructor(message) {
    super(404, message || 'Resource Not Found');
  }
}
