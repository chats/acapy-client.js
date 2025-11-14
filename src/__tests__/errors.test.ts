import { ACAcpyError, ConnectionError, CredentialError, ProofError } from '../errors';

describe('Error Classes', () => {
  describe('ACAcpyError', () => {
    it('should create an error with message', () => {
      const error = new ACAcpyError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ACAcpyError');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ACAcpyError);
    });

    it('should include status code and response', () => {
      const response = { detail: 'Error details' };
      const error = new ACAcpyError('Test error', 404, response);
      expect(error.statusCode).toBe(404);
      expect(error.response).toEqual(response);
    });
  });

  describe('ConnectionError', () => {
    it('should create a connection error', () => {
      const error = new ConnectionError('Connection failed');
      expect(error.message).toBe('Connection failed');
      expect(error.name).toBe('ConnectionError');
      expect(error).toBeInstanceOf(ACAcpyError);
      expect(error).toBeInstanceOf(ConnectionError);
    });
  });

  describe('CredentialError', () => {
    it('should create a credential error', () => {
      const error = new CredentialError('Credential issuance failed', 400);
      expect(error.message).toBe('Credential issuance failed');
      expect(error.name).toBe('CredentialError');
      expect(error.statusCode).toBe(400);
      expect(error).toBeInstanceOf(ACAcpyError);
      expect(error).toBeInstanceOf(CredentialError);
    });
  });

  describe('ProofError', () => {
    it('should create a proof error', () => {
      const error = new ProofError('Proof verification failed', 422);
      expect(error.message).toBe('Proof verification failed');
      expect(error.name).toBe('ProofError');
      expect(error.statusCode).toBe(422);
      expect(error).toBeInstanceOf(ACAcpyError);
      expect(error).toBeInstanceOf(ProofError);
    });
  });
});
