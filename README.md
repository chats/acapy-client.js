# ACA-Py Client for TypeScript

A TypeScript client library for interacting with [Aries Cloud Agent Python (ACA-Py)](https://github.com/hyperledger/aries-cloudagent-python) API.

[![npm version](https://badge.fury.io/js/%40chats%2Facapy-client-js.svg)](https://badge.fury.io/js/%40chats%2Facapy-client-js)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Features

- 🔐 **Full ACA-Py API Support** - Comprehensive coverage of connections, credentials, proofs, and more
- 📘 **TypeScript First** - Complete type definitions and IntelliSense support
- 🛡️ **Error Handling** - Specialized error classes for different operation types
- 🧪 **Well Tested** - Extensive test coverage with Jest
- 📦 **GitHub Packages** - Ready to publish to GitHub npm registry

## Installation

### From GitHub Packages

First, configure npm to use GitHub Packages for `@chats` scoped packages:

```bash
npm login --registry=https://npm.pkg.github.com
```

Then install the package:

```bash
npm install @chats/acapy-client-js
```

Or with yarn:

```bash
yarn add @chats/acapy-client-js
```

## Quick Start

```typescript
import { ACAcpyClient } from '@chats/acapy-client-js';

// Initialize the client
const client = new ACAcpyClient({
  baseUrl: 'http://localhost:8031',
  apiKey: 'your-api-key', // Optional
});

// Check if agent is ready
const isReady = await client.isReady();
console.log('Agent ready:', isReady);

// Create a connection invitation
const invitation = await client.createInvitation({
  alias: 'My Connection',
  auto_accept: true,
});

console.log('Invitation URL:', invitation.invitation_url);
```

## Usage Examples

### Managing Connections

```typescript
// Get all connections
const connections = await client.getConnections();

// Get a specific connection
const connection = await client.getConnection('connection-id');

// Create an invitation
const invitation = await client.createInvitation({
  alias: 'Business Partner',
  auto_accept: true,
  multi_use: false,
});

// Receive an invitation
const connection = await client.receiveInvitation(invitationObject, {
  alias: 'Partner Connection',
  auto_accept: true,
});

// Accept a connection request
await client.acceptConnectionRequest('connection-id');

// Delete a connection
await client.deleteConnection('connection-id');
```

### Schema and Credential Definitions

```typescript
// Create a schema
const schema = await client.createSchema({
  schema_name: 'Employee Credential',
  schema_version: '1.0',
  attributes: ['employee_id', 'name', 'position', 'hire_date'],
});

// Get a schema
const schema = await client.getSchema('schema-id');

// Create a credential definition
const credDef = await client.createCredentialDefinition({
  schema_id: schema.id,
  tag: 'default',
  support_revocation: false,
});

// Get a credential definition
const credDef = await client.getCredentialDefinition('cred-def-id');
```

### Issuing Credentials

```typescript
// Send a credential offer
const credentialExchange = await client.sendCredentialOffer({
  credential_definition_id: 'cred-def-id',
  connection_id: 'connection-id',
  auto_issue: true,
  credential_preview: {
    '@type': 'issue-credential/1.0/credential-preview',
    attributes: [
      { name: 'employee_id', value: 'EMP001' },
      { name: 'name', value: 'John Doe' },
      { name: 'position', value: 'Software Engineer' },
      { name: 'hire_date', value: '2024-01-15' },
    ],
  },
});

// Get all credential exchanges
const exchanges = await client.getCredentialExchanges();

// Get a specific credential exchange
const exchange = await client.getCredentialExchange('cred-ex-id');

// Issue a credential (manual flow)
await client.issueCredential('cred-ex-id');

// Store a received credential
await client.storeCredential('cred-ex-id');
```

### Requesting Proofs

```typescript
// Send a proof request
const presentationExchange = await client.sendProofRequest({
  connection_id: 'connection-id',
  comment: 'Please provide proof of employment',
  proof_request: {
    name: 'Employment Verification',
    version: '1.0',
    requested_attributes: {
      employee_info: {
        name: 'employee_id',
        restrictions: [
          {
            cred_def_id: 'cred-def-id',
          },
        ],
      },
    },
    requested_predicates: {},
  },
});

// Get all presentation exchanges
const presentations = await client.getPresentationExchanges();

// Get a specific presentation exchange
const presentation = await client.getPresentationExchange('pres-ex-id');

// Verify a presentation
await client.verifyPresentation('pres-ex-id');
```

### Wallet Operations

```typescript
// Get all DIDs in wallet
const dids = await client.getWalletDIDs();

// Create a new DID
const did = await client.createDID('sov'); // or 'key', 'web', etc.

// Get public DID
const publicDID = await client.getPublicDID();
```

### Basic Messaging

```typescript
// Send a basic message
await client.sendBasicMessage({
  connection_id: 'connection-id',
  content: 'Hello from ACA-Py client!',
});
```

### Status Checks

```typescript
// Get agent status
const status = await client.getStatus();

// Check if agent is ready
const isReady = await client.isReady();

// Check if agent is alive
const isAlive = await client.isAlive();
```

## Error Handling

The client provides specialized error classes for different operations:

```typescript
import { ACAcpyError, ConnectionError, CredentialError, ProofError } from '@chats/acapy-client-js';

try {
  const connection = await client.getConnection('invalid-id');
} catch (error) {
  if (error instanceof ConnectionError) {
    console.error('Connection error:', error.message);
    console.error('Status code:', error.statusCode);
    console.error('Response:', error.response);
  } else if (error instanceof ACAcpyError) {
    console.error('ACA-Py error:', error.message);
  }
}
```

## API Reference

### Configuration

```typescript
interface ACAcpyClientConfig {
  baseUrl: string;           // ACA-Py agent URL
  apiKey?: string;           // API key for authentication
  headers?: Record<string, string>;  // Custom headers
  timeout?: number;          // Request timeout (default: 30000ms)
}
```

### Client Methods

#### Connections
- `getConnections()` - Get all connections
- `getConnection(connectionId)` - Get a specific connection
- `createInvitation(params?)` - Create a connection invitation
- `receiveInvitation(invitation, params?)` - Receive and accept an invitation
- `acceptConnectionRequest(connectionId)` - Accept a connection request
- `deleteConnection(connectionId)` - Delete a connection

#### Schemas
- `createSchema(params)` - Create a new schema
- `getSchema(schemaId)` - Get a schema by ID

#### Credential Definitions
- `createCredentialDefinition(params)` - Create a credential definition
- `getCredentialDefinition(credDefId)` - Get a credential definition by ID

#### Credentials
- `sendCredentialOffer(offer)` - Send a credential offer
- `getCredentialExchanges()` - Get all credential exchanges
- `getCredentialExchange(credExId)` - Get a specific credential exchange
- `issueCredential(credExId)` - Issue a credential
- `storeCredential(credExId)` - Store a received credential

#### Proofs
- `sendProofRequest(proofRequest)` - Send a proof request
- `getPresentationExchanges()` - Get all presentation exchanges
- `getPresentationExchange(presExId)` - Get a specific presentation exchange
- `verifyPresentation(presExId)` - Verify a presentation

#### Wallet
- `getWalletDIDs()` - Get all DIDs in wallet
- `createDID(method?)` - Create a new DID
- `getPublicDID()` - Get the public DID

#### Messaging
- `sendBasicMessage(message)` - Send a basic message

#### Status
- `getStatus()` - Get agent status
- `isReady()` - Check if agent is ready
- `isAlive()` - Check if agent is alive

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Publishing to GitHub Packages

1. Update the package name in `package.json` to match your GitHub organization:
   ```json
   {
     "name": "@chats/acapy-client-js"
   }
   ```

2. Create a `.npmrc` file with your GitHub token:
   ```
   @chats:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

3. Build and publish:
   ```bash
   npm run build
   npm publish
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache-2.0

## Resources

- [ACA-Py Documentation](https://aca-py.org/)
- [ACA-Py GitHub Repository](https://github.com/hyperledger/aries-cloudagent-python)
- [Hyperledger Aries](https://www.hyperledger.org/use/aries)
- [Decentralized Identity Foundation](https://identity.foundation/)

## Support

For issues and questions:
- Create an issue on [GitHub](https://github.com/chats/acapy-client-js/issues)
- Check the [ACA-Py documentation](https://aca-py.org/)
