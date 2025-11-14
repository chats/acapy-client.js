import { ACAcpyClient } from '../client';
import { ConnectionError, CredentialError, ProofError } from '../errors';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ACAcpyClient', () => {
  let client: ACAcpyClient;
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      response: {
        use: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    client = new ACAcpyClient({
      baseUrl: 'http://localhost:8031',
      apiKey: 'test-api-key',
    });
  });

  describe('Constructor', () => {
    it('should create a client with base configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:8031',
          timeout: 30000,
        })
      );
    });

    it('should include API key in headers when provided', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'test-api-key',
          }),
        })
      );
    });
  });

  describe('Connection Methods', () => {
    it('should get all connections', async () => {
      const mockConnections = [
        { connection_id: '1', state: 'active' },
        { connection_id: '2', state: 'pending' },
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: { results: mockConnections } });

      const result = await client.getConnections();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/connections');
      expect(result).toEqual(mockConnections);
    });

    it('should get a specific connection', async () => {
      const mockConnection = { connection_id: '1', state: 'active' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockConnection });

      const result = await client.getConnection('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/connections/1');
      expect(result).toEqual(mockConnection);
    });

    it('should create an invitation', async () => {
      const mockResponse = {
        connection_id: '1',
        invitation: { '@type': 'invitation', '@id': '123' },
        invitation_url: 'http://example.com/invitation',
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await client.createInvitation({ alias: 'test' });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/connections/create-invitation', null, {
        params: { alias: 'test' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw ConnectionError on failure', async () => {
      mockAxiosInstance.get.mockRejectedValue({
        response: { status: 404, data: { message: 'Not found' } },
        message: 'Request failed',
      });

      await expect(client.getConnection('invalid')).rejects.toThrow(ConnectionError);
    });
  });

  describe('Credential Methods', () => {
    it('should create a schema', async () => {
      const mockSchema = {
        id: 'schema-id',
        name: 'Test Schema',
        version: '1.0',
        attrNames: ['name', 'age'],
      };
      mockAxiosInstance.post.mockResolvedValue({ data: { schema: mockSchema } });

      const result = await client.createSchema({
        schema_name: 'Test Schema',
        schema_version: '1.0',
        attributes: ['name', 'age'],
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schemas', {
        schema_name: 'Test Schema',
        schema_version: '1.0',
        attributes: ['name', 'age'],
      });
      expect(result).toEqual(mockSchema);
    });

    it('should send a credential offer', async () => {
      const mockOffer = {
        credential_definition_id: 'cred-def-id',
        connection_id: 'conn-id',
        credential_preview: {
          '@type': 'issue-credential/1.0/credential-preview',
          attributes: [{ name: 'name', value: 'John' }],
        },
      };
      const mockExchange = {
        credential_exchange_id: 'ex-id',
        connection_id: 'conn-id',
        thread_id: 'thread-id',
        state: 'offer_sent',
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockExchange });

      const result = await client.sendCredentialOffer(mockOffer);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/issue-credential/send-offer',
        mockOffer
      );
      expect(result).toEqual(mockExchange);
    });

    it('should throw CredentialError on failure', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        response: { status: 400, data: { message: 'Invalid schema' } },
        message: 'Request failed',
      });

      await expect(
        client.createSchema({
          schema_name: 'Invalid',
          schema_version: '1.0',
          attributes: [],
        })
      ).rejects.toThrow(CredentialError);
    });
  });

  describe('Proof Methods', () => {
    it('should send a proof request', async () => {
      const mockProofRequest = {
        connection_id: 'conn-id',
        proof_request: {
          name: 'Proof Request',
          version: '1.0',
          requested_attributes: {},
          requested_predicates: {},
        },
      };
      const mockExchange = {
        presentation_exchange_id: 'pres-ex-id',
        connection_id: 'conn-id',
        thread_id: 'thread-id',
        state: 'request_sent',
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockExchange });

      const result = await client.sendProofRequest(mockProofRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/present-proof/send-request',
        mockProofRequest
      );
      expect(result).toEqual(mockExchange);
    });

    it('should throw ProofError on failure', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        response: { status: 400, data: { message: 'Invalid proof request' } },
        message: 'Request failed',
      });

      await expect(
        client.sendProofRequest({
          connection_id: 'conn-id',
          proof_request: {
            name: 'Invalid',
            version: '1.0',
            requested_attributes: {},
            requested_predicates: {},
          },
        })
      ).rejects.toThrow(ProofError);
    });
  });

  describe('Status Methods', () => {
    it('should check if agent is ready', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { ready: true } });

      const result = await client.isReady();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/status/ready');
      expect(result).toBe(true);
    });

    it('should return false if agent is not ready', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Agent not ready'));

      const result = await client.isReady();

      expect(result).toBe(false);
    });

    it('should check if agent is alive', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { alive: true } });

      const result = await client.isAlive();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/status/live');
      expect(result).toBe(true);
    });
  });

  describe('Wallet Methods', () => {
    it('should get wallet DIDs', async () => {
      const mockDIDs = [
        { did: 'did:sov:123', verkey: 'verkey1', posture: 'wallet_only' },
        { did: 'did:sov:456', verkey: 'verkey2', posture: 'public' },
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: { results: mockDIDs } });

      const result = await client.getWalletDIDs();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/wallet/did');
      expect(result).toEqual(mockDIDs);
    });

    it('should create a DID', async () => {
      const mockDID = { did: 'did:sov:789', verkey: 'verkey3', posture: 'wallet_only' };
      mockAxiosInstance.post.mockResolvedValue({ data: { result: mockDID } });

      const result = await client.createDID('sov');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/wallet/did/create', { method: 'sov' });
      expect(result).toEqual(mockDID);
    });
  });
});
