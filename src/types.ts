/**
 * Configuration options for the ACApy client
 */
export interface ACAcpyClientConfig {
  /**
   * Base URL of the ACA-Py agent (e.g., 'http://localhost:8031')
   */
  baseUrl: string;

  /**
   * API key for authentication (if required)
   */
  apiKey?: string;

  /**
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;

  /**
   * Request timeout in milliseconds (default: 30000)
   */
  timeout?: number;
}

/**
 * Connection record from ACA-Py
 */
export interface Connection {
  connection_id: string;
  state: string;
  their_label?: string;
  their_role?: string;
  invitation_key?: string;
  invitation_mode?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Connection invitation
 */
export interface ConnectionInvitation {
  '@type': string;
  '@id': string;
  label: string;
  recipientKeys: string[];
  serviceEndpoint: string;
}

/**
 * Credential definition
 */
export interface CredentialDefinition {
  id: string;
  tag: string;
  schema_id: string;
  type: string;
  value: {
    primary: Record<string, unknown>;
    revocation?: Record<string, unknown>;
  };
}

/**
 * Schema definition
 */
export interface Schema {
  id: string;
  name: string;
  version: string;
  attrNames: string[];
  seqNo?: number;
}

/**
 * Credential preview attribute
 */
export interface CredentialPreviewAttribute {
  name: string;
  value: string;
  'mime-type'?: string;
}

/**
 * Credential offer
 */
export interface CredentialOffer {
  credential_definition_id: string;
  connection_id: string;
  comment?: string;
  auto_remove?: boolean;
  auto_issue?: boolean;
  trace?: boolean;
  credential_preview: {
    '@type': string;
    attributes: CredentialPreviewAttribute[];
  };
}

/**
 * Credential exchange record
 */
export interface CredentialExchange {
  credential_exchange_id: string;
  connection_id: string;
  thread_id: string;
  state: string;
  credential_definition_id?: string;
  schema_id?: string;
  credential?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

/**
 * Proof request
 */
export interface ProofRequest {
  connection_id: string;
  comment?: string;
  proof_request: {
    name: string;
    version: string;
    requested_attributes: Record<string, unknown>;
    requested_predicates: Record<string, unknown>;
  };
  trace?: boolean;
}

/**
 * Presentation exchange record
 */
export interface PresentationExchange {
  presentation_exchange_id: string;
  connection_id: string;
  thread_id: string;
  state: string;
  verified?: string;
  presentation?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

/**
 * Wallet DID
 */
export interface WalletDID {
  did: string;
  verkey: string;
  posture: string;
  method?: string;
}

/**
 * Basic message
 */
export interface BasicMessage {
  connection_id: string;
  content: string;
}

/**
 * API response wrapper
 */
export interface ACAcpyResponse<T> {
  results?: T[];
  [key: string]: unknown;
}
