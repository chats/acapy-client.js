# Project Overview: ACA-Py TypeScript Client

## 📦 Package Information

- **Name:** `@chats/acapy-client`
- **Version:** 1.0.0
- **License:** Apache-2.0
- **Target Registry:** GitHub Packages (npm)
- **Language:** TypeScript
- **Runtime:** Node.js 18+

## 🎯 Purpose

A fully-featured TypeScript client library for interacting with Aries Cloud Agent Python (ACA-Py) API. This package enables developers to build decentralized identity applications using ACA-Py agents with type-safe, modern JavaScript/TypeScript code.

## 📁 Project Structure

```
acapy-client-js/
├── src/                          # Source code
│   ├── client.ts                 # Main ACAcpyClient class
│   ├── types.ts                  # TypeScript type definitions
│   ├── errors.ts                 # Custom error classes
│   ├── index.ts                  # Package entry point
│   └── __tests__/                # Test files
│       ├── client.test.ts        # Client tests
│       └── errors.test.ts        # Error class tests
│
├── examples/                     # Usage examples
│   ├── quick-start.ts            # Quick start guide
│   ├── simple-connection.ts      # Connection workflow
│   ├── credential-issuance.ts    # Credential issuance workflow
│   └── proof-verification.ts     # Proof verification workflow
│
├── .github/workflows/            # GitHub Actions
│   ├── ci.yml                    # Continuous Integration
│   └── publish.yml               # Automated publishing
│
├── dist/                         # Compiled JavaScript (generated)
│   ├── *.js                      # Compiled JavaScript files
│   ├── *.d.ts                    # TypeScript declaration files
│   └── *.map                     # Source maps
│
├── Configuration Files
│   ├── package.json              # NPM package configuration
│   ├── tsconfig.json             # TypeScript compiler config
│   ├── jest.config.js            # Jest testing config
│   ├── eslint.config.js          # ESLint configuration
│   ├── .prettierrc               # Prettier formatting config
│   ├── .npmrc                    # NPM registry configuration
│   └── .gitignore                # Git ignore rules
│
└── Documentation
    ├── README.md                 # Main documentation
    ├── SETUP.md                  # Publishing setup guide
    ├── CONTRIBUTING.md           # Contribution guidelines
    ├── CHANGELOG.md              # Version history
    └── LICENSE                   # Apache 2.0 license
```

## 🚀 Features

### Core Functionality
- ✅ **Connection Management** - Create, receive, accept, and delete connections
- ✅ **Schema Operations** - Create and retrieve schemas
- ✅ **Credential Definitions** - Create and retrieve credential definitions
- ✅ **Credential Issuance** - Full credential lifecycle (offer, issue, store)
- ✅ **Proof Requests** - Request and verify presentations
- ✅ **Wallet Operations** - DID management and queries
- ✅ **Basic Messaging** - Send messages over connections
- ✅ **Agent Status** - Health checks and status queries

### Developer Experience
- 📘 **Full TypeScript Support** - Complete type definitions for all APIs
- 🛡️ **Error Handling** - Specialized error classes for different operations
- 🧪 **100% Test Coverage** - Comprehensive Jest test suite
- 📚 **Rich Documentation** - Detailed README with examples
- 🔄 **CI/CD Ready** - GitHub Actions for testing and publishing
- 🎨 **Code Quality** - ESLint, Prettier, and strict TypeScript

## 📊 Statistics

- **Source Files:** 4 TypeScript files (~600 lines of code)
- **Test Files:** 2 test suites (21 tests)
- **Examples:** 4 complete workflow examples
- **Dependencies:** 1 runtime dependency (axios)
- **Dev Dependencies:** 13 packages (TypeScript, Jest, ESLint, etc.)

## 🔧 Available Scripts

```bash
npm run build          # Compile TypeScript to JavaScript
npm run clean          # Remove dist directory
npm test               # Run Jest tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm run lint           # Lint code with ESLint
npm run lint:fix       # Fix linting issues
npm run format         # Format code with Prettier
```

## 📦 Package Contents

When published, the package includes:
- `dist/` - Compiled JavaScript and type definitions
- `README.md` - Documentation
- `LICENSE` - Apache 2.0 license
- `package.json` - Package metadata

## 🔐 API Coverage

### Connections (6 methods)
- `getConnections()` - List all connections
- `getConnection(id)` - Get specific connection
- `createInvitation()` - Create invitation
- `receiveInvitation()` - Receive invitation
- `acceptConnectionRequest()` - Accept request
- `deleteConnection()` - Delete connection

### Schemas (2 methods)
- `createSchema()` - Create new schema
- `getSchema()` - Retrieve schema

### Credential Definitions (2 methods)
- `createCredentialDefinition()` - Create definition
- `getCredentialDefinition()` - Retrieve definition

### Credentials (5 methods)
- `sendCredentialOffer()` - Send offer
- `getCredentialExchanges()` - List exchanges
- `getCredentialExchange()` - Get specific exchange
- `issueCredential()` - Issue credential
- `storeCredential()` - Store credential

### Proofs (4 methods)
- `sendProofRequest()` - Request proof
- `getPresentationExchanges()` - List exchanges
- `getPresentationExchange()` - Get specific exchange
- `verifyPresentation()` - Verify presentation

### Wallet (3 methods)
- `getWalletDIDs()` - List DIDs
- `createDID()` - Create DID
- `getPublicDID()` - Get public DID

### Messaging (1 method)
- `sendBasicMessage()` - Send message

### Status (3 methods)
- `getStatus()` - Get agent status
- `isReady()` - Check if ready
- `isAlive()` - Check if alive

**Total: 26 API methods**

## 🧪 Test Coverage

- ✅ Client initialization and configuration
- ✅ Connection operations (create, receive, get, delete)
- ✅ Schema and credential definition creation
- ✅ Credential issuance workflow
- ✅ Proof request and verification
- ✅ Wallet operations
- ✅ Status checks
- ✅ Error handling for all error types
- ✅ Custom error class behavior

## 📖 Documentation

### Main Documentation
- **README.md** - Complete API reference, usage examples, installation guide
- **SETUP.md** - Step-by-step publishing guide for GitHub Packages
- **CONTRIBUTING.md** - Contribution guidelines and development workflow
- **CHANGELOG.md** - Version history and release notes

### Code Examples
- **quick-start.ts** - Basic usage and agent status checks
- **simple-connection.ts** - Complete connection establishment workflow
- **credential-issuance.ts** - End-to-end credential issuance
- **proof-verification.ts** - Complete proof request and verification

## 🔄 CI/CD Pipeline

### Continuous Integration (ci.yml)
- Triggers: Push and PRs to main/develop branches
- Tests on: Node.js 18.x and 20.x
- Steps: Install → Lint → Test → Coverage → Build
- Coverage upload to Codecov

### Publish Workflow (publish.yml)
- Triggers: GitHub releases and manual dispatch
- Steps: Checkout → Setup → Test → Build → Publish
- Automatic publishing to GitHub Packages


### 📝 **Next Steps to Publish:**

1. **Update package name** in `package.json` (already set to `@chats/acapy-client`)

2. **Update .npmrc** with your org name (already set to `@chats`)

3. **Create GitHub Personal Access Token** (with `write:packages` scope)

## 🔗 Related Resources

- [ACA-Py Documentation](https://aca-py.org/)
- [ACA-Py GitHub](https://github.com/hyperledger/aries-cloudagent-python)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Hyperledger Aries](https://www.hyperledger.org/use/aries)

## ✨ Key Highlights

1. **Production Ready** - Fully tested, documented, and type-safe
2. **Developer Friendly** - IntelliSense support, clear error messages
3. **Best Practices** - Follows TypeScript and npm conventions
4. **CI/CD Integrated** - Automated testing and publishing
5. **Well Documented** - Comprehensive docs and working examples
6. **Extensible** - Easy to add new ACA-Py API endpoints
7. **GitHub Packages** - Ready to publish and share

## 📝 License

Apache License 2.0 - See LICENSE file for details
