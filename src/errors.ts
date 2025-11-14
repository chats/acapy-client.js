/**
 * Custom error class for ACA-Py client errors
 */
export class ACAcpyError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ACAcpyError';
    Object.setPrototypeOf(this, ACAcpyError.prototype);
  }
}

/**
 * Error for connection-related issues
 */
export class ConnectionError extends ACAcpyError {
  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message, statusCode, response);
    this.name = 'ConnectionError';
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}

/**
 * Error for credential-related issues
 */
export class CredentialError extends ACAcpyError {
  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message, statusCode, response);
    this.name = 'CredentialError';
    Object.setPrototypeOf(this, CredentialError.prototype);
  }
}

/**
 * Error for proof/presentation-related issues
 */
export class ProofError extends ACAcpyError {
  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message, statusCode, response);
    this.name = 'ProofError';
    Object.setPrototypeOf(this, ProofError.prototype);
  }
}
