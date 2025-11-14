import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ACAcpyClientConfig,
  Connection,
  ConnectionInvitation,
  CredentialDefinition,
  Schema,
  CredentialOffer,
  CredentialExchange,
  ProofRequest,
  PresentationExchange,
  WalletDID,
  BasicMessage,
  ACAcpyResponse,
} from './types';
import { ACAcpyError, ConnectionError, CredentialError, ProofError } from './errors';

/**
 * ACA-Py Client for interacting with Aries Cloud Agent Python API
 */
export class ACAcpyClient {
  private client: AxiosInstance;

  /**
   * Creates a new ACA-Py client instance
   * @param config - Configuration options for the client
   */
  constructor(config: ACAcpyClientConfig) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (config.apiKey) {
      headers['X-API-Key'] = config.apiKey;
    }

    this.client = axios.create({
      baseURL: config.baseUrl,
      headers,
      timeout: config.timeout || 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle axios errors and convert to custom errors
   */
  private handleError(error: AxiosError): ACAcpyError {
    const message = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    const statusCode = error.response?.status;

    return new ACAcpyError(message, statusCode, error.response?.data);
  }

  // ==================== Connection Methods ====================

  /**
   * Get all connections
   */
  async getConnections(): Promise<Connection[]> {
    try {
      const response = await this.client.get<ACAcpyResponse<Connection>>('/connections');
      return response.data.results || [];
    } catch (error) {
      throw new ConnectionError('Failed to get connections', (error as ACAcpyError).statusCode);
    }
  }

  /**
   * Get a specific connection by ID
   */
  async getConnection(connectionId: string): Promise<Connection> {
    try {
      const response = await this.client.get<Connection>(`/connections/${connectionId}`);
      return response.data;
    } catch (error) {
      throw new ConnectionError(
        `Failed to get connection: ${connectionId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Create a new invitation
   */
  async createInvitation(params?: {
    alias?: string;
    auto_accept?: boolean;
    multi_use?: boolean;
    public?: boolean;
  }): Promise<{ connection_id: string; invitation: ConnectionInvitation; invitation_url: string }> {
    try {
      const response = await this.client.post('/connections/create-invitation', null, { params });
      return response.data;
    } catch (error) {
      throw new ConnectionError('Failed to create invitation', (error as ACAcpyError).statusCode);
    }
  }

  /**
   * Receive and accept an invitation
   */
  async receiveInvitation(
    invitation: ConnectionInvitation,
    params?: { alias?: string; auto_accept?: boolean }
  ): Promise<Connection> {
    try {
      const response = await this.client.post<Connection>(
        '/connections/receive-invitation',
        invitation,
        { params }
      );
      return response.data;
    } catch (error) {
      throw new ConnectionError('Failed to receive invitation', (error as ACAcpyError).statusCode);
    }
  }

  /**
   * Accept a connection request
   */
  async acceptConnectionRequest(connectionId: string): Promise<Connection> {
    try {
      const response = await this.client.post<Connection>(
        `/connections/${connectionId}/accept-request`
      );
      return response.data;
    } catch (error) {
      throw new ConnectionError(
        `Failed to accept connection request: ${connectionId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Delete a connection
   */
  async deleteConnection(connectionId: string): Promise<void> {
    try {
      await this.client.delete(`/connections/${connectionId}`);
    } catch (error) {
      throw new ConnectionError(
        `Failed to delete connection: ${connectionId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  // ==================== Schema Methods ====================

  /**
   * Create a new schema
   */
  async createSchema(params: {
    schema_name: string;
    schema_version: string;
    attributes: string[];
  }): Promise<Schema> {
    try {
      const response = await this.client.post<{ schema: Schema }>('/schemas', params);
      return response.data.schema;
    } catch (error) {
      throw new CredentialError('Failed to create schema', (error as ACAcpyError).statusCode);
    }
  }

  /**
   * Get a schema by ID
   */
  async getSchema(schemaId: string): Promise<Schema> {
    try {
      const response = await this.client.get<{ schema: Schema }>(`/schemas/${schemaId}`);
      return response.data.schema;
    } catch (error) {
      throw new CredentialError(
        `Failed to get schema: ${schemaId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  // ==================== Credential Definition Methods ====================

  /**
   * Create a credential definition
   */
  async createCredentialDefinition(params: {
    schema_id: string;
    tag: string;
    support_revocation?: boolean;
    revocation_registry_size?: number;
  }): Promise<CredentialDefinition> {
    try {
      const response = await this.client.post<{ credential_definition: CredentialDefinition }>(
        '/credential-definitions',
        params
      );
      return response.data.credential_definition;
    } catch (error) {
      throw new CredentialError(
        'Failed to create credential definition',
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Get a credential definition by ID
   */
  async getCredentialDefinition(credDefId: string): Promise<CredentialDefinition> {
    try {
      const response = await this.client.get<{ credential_definition: CredentialDefinition }>(
        `/credential-definitions/${credDefId}`
      );
      return response.data.credential_definition;
    } catch (error) {
      throw new CredentialError(
        `Failed to get credential definition: ${credDefId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  // ==================== Credential Exchange Methods ====================

  /**
   * Send a credential offer
   */
  async sendCredentialOffer(offer: CredentialOffer): Promise<CredentialExchange> {
    try {
      const response = await this.client.post<CredentialExchange>(
        '/issue-credential/send-offer',
        offer
      );
      return response.data;
    } catch (error) {
      throw new CredentialError(
        'Failed to send credential offer',
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Get all credential exchange records
   */
  async getCredentialExchanges(): Promise<CredentialExchange[]> {
    try {
      const response = await this.client.get<ACAcpyResponse<CredentialExchange>>(
        '/issue-credential/records'
      );
      return response.data.results || [];
    } catch (error) {
      throw new CredentialError(
        'Failed to get credential exchanges',
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Get a specific credential exchange record
   */
  async getCredentialExchange(credentialExchangeId: string): Promise<CredentialExchange> {
    try {
      const response = await this.client.get<CredentialExchange>(
        `/issue-credential/records/${credentialExchangeId}`
      );
      return response.data;
    } catch (error) {
      throw new CredentialError(
        `Failed to get credential exchange: ${credentialExchangeId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Issue a credential
   */
  async issueCredential(credentialExchangeId: string): Promise<CredentialExchange> {
    try {
      const response = await this.client.post<CredentialExchange>(
        `/issue-credential/records/${credentialExchangeId}/issue`
      );
      return response.data;
    } catch (error) {
      throw new CredentialError(
        `Failed to issue credential: ${credentialExchangeId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Store a received credential
   */
  async storeCredential(credentialExchangeId: string): Promise<CredentialExchange> {
    try {
      const response = await this.client.post<CredentialExchange>(
        `/issue-credential/records/${credentialExchangeId}/store`
      );
      return response.data;
    } catch (error) {
      throw new CredentialError(
        `Failed to store credential: ${credentialExchangeId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  // ==================== Proof/Presentation Methods ====================

  /**
   * Send a proof request
   */
  async sendProofRequest(proofRequest: ProofRequest): Promise<PresentationExchange> {
    try {
      const response = await this.client.post<PresentationExchange>(
        '/present-proof/send-request',
        proofRequest
      );
      return response.data;
    } catch (error) {
      throw new ProofError('Failed to send proof request', (error as ACAcpyError).statusCode);
    }
  }

  /**
   * Get all presentation exchange records
   */
  async getPresentationExchanges(): Promise<PresentationExchange[]> {
    try {
      const response =
        await this.client.get<ACAcpyResponse<PresentationExchange>>('/present-proof/records');
      return response.data.results || [];
    } catch (error) {
      throw new ProofError(
        'Failed to get presentation exchanges',
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Get a specific presentation exchange record
   */
  async getPresentationExchange(presentationExchangeId: string): Promise<PresentationExchange> {
    try {
      const response = await this.client.get<PresentationExchange>(
        `/present-proof/records/${presentationExchangeId}`
      );
      return response.data;
    } catch (error) {
      throw new ProofError(
        `Failed to get presentation exchange: ${presentationExchangeId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  /**
   * Verify a presentation
   */
  async verifyPresentation(presentationExchangeId: string): Promise<PresentationExchange> {
    try {
      const response = await this.client.post<PresentationExchange>(
        `/present-proof/records/${presentationExchangeId}/verify-presentation`
      );
      return response.data;
    } catch (error) {
      throw new ProofError(
        `Failed to verify presentation: ${presentationExchangeId}`,
        (error as ACAcpyError).statusCode
      );
    }
  }

  // ==================== Wallet Methods ====================

  /**
   * Get DIDs from wallet
   */
  async getWalletDIDs(): Promise<WalletDID[]> {
    try {
      const response = await this.client.get<ACAcpyResponse<WalletDID>>('/wallet/did');
      return response.data.results || [];
    } catch (error) {
      throw new ACAcpyError('Failed to get wallet DIDs', (error as ACAcpyError).statusCode);
    }
  }

  /**
   * Create a new DID in wallet
   */
  async createDID(method?: string): Promise<WalletDID> {
    try {
      const response = await this.client.post<{ result: WalletDID }>('/wallet/did/create', {
        method,
      });
      return response.data.result;
    } catch (error) {
      throw new ACAcpyError('Failed to create DID', (error as ACAcpyError).statusCode);
    }
  }

  /**
   * Get public DID
   */
  async getPublicDID(): Promise<WalletDID | null> {
    try {
      const response = await this.client.get<{ result: WalletDID | null }>('/wallet/did/public');
      return response.data.result;
    } catch (error) {
      throw new ACAcpyError('Failed to get public DID', (error as ACAcpyError).statusCode);
    }
  }

  // ==================== Basic Messaging Methods ====================

  /**
   * Send a basic message
   */
  async sendBasicMessage(message: BasicMessage): Promise<void> {
    try {
      await this.client.post(`/connections/${message.connection_id}/send-message`, {
        content: message.content,
      });
    } catch (error) {
      throw new ACAcpyError('Failed to send basic message', (error as ACAcpyError).statusCode);
    }
  }

  // ==================== Status Methods ====================

  /**
   * Get agent status
   */
  async getStatus(): Promise<Record<string, unknown>> {
    try {
      const response = await this.client.get<Record<string, unknown>>('/status');
      return response.data;
    } catch (error) {
      throw new ACAcpyError('Failed to get agent status', (error as ACAcpyError).statusCode);
    }
  }

  /**
   * Check if agent is ready
   */
  async isReady(): Promise<boolean> {
    try {
      const response = await this.client.get<{ ready: boolean }>('/status/ready');
      return response.data.ready;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if agent is alive
   */
  async isAlive(): Promise<boolean> {
    try {
      const response = await this.client.get<{ alive: boolean }>('/status/live');
      return response.data.alive;
    } catch (error) {
      return false;
    }
  }
}
