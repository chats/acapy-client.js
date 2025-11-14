import { ACAcpyClient } from '../src';

/**
 * Quick Start Example
 *
 * This example demonstrates basic usage of the ACA-Py client library.
 *
 * Prerequisites:
 * 1. An ACA-Py agent running (e.g., on http://localhost:8031)
 * 2. API key configured (if required)
 *
 * To run this example:
 * npm install
 * npm run build
 * npx ts-node examples/quick-start.ts
 */

async function quickStart() {
  console.log('🚀 ACA-Py Client - Quick Start Example\n');

  // Step 1: Initialize the client
  console.log('📝 Step 1: Initialize the client');
  const client = new ACAcpyClient({
    baseUrl: process.env.ACAPY_URL || 'http://localhost:8031',
    apiKey: process.env.ACAPY_API_KEY, // Optional
    timeout: 30000,
  });
  console.log('✅ Client initialized\n');

  try {
    // Step 2: Check agent status
    console.log('📊 Step 2: Check agent status');
    const isAlive = await client.isAlive();
    const isReady = await client.isReady();
    console.log(`   Agent alive: ${isAlive}`);
    console.log(`   Agent ready: ${isReady}`);

    if (!isReady) {
      console.log('❌ Agent is not ready. Please ensure ACA-Py is running.\n');
      return;
    }
    console.log('✅ Agent is ready\n');

    // Step 3: Get agent status
    console.log('📊 Step 3: Get detailed agent status');
    const status = await client.getStatus();
    console.log('   Status:', JSON.stringify(status, null, 2));
    console.log('✅ Status retrieved\n');

    // Step 4: Get wallet DIDs
    console.log('💼 Step 4: Get wallet DIDs');
    const dids = await client.getWalletDIDs();
    console.log(`   Found ${dids.length} DID(s) in wallet`);
    dids.forEach((did, index) => {
      console.log(`   ${index + 1}. DID: ${did.did}`);
      console.log(`      Verkey: ${did.verkey}`);
      console.log(`      Posture: ${did.posture}`);
    });
    console.log('✅ Wallet DIDs retrieved\n');

    // Step 5: Get public DID
    console.log('🔑 Step 5: Get public DID');
    const publicDID = await client.getPublicDID();
    if (publicDID) {
      console.log(`   Public DID: ${publicDID.did}`);
      console.log(`   Verkey: ${publicDID.verkey}`);
    } else {
      console.log('   No public DID configured');
    }
    console.log('✅ Public DID checked\n');

    // Step 6: Get connections
    console.log('🔗 Step 6: Get existing connections');
    const connections = await client.getConnections();
    console.log(`   Found ${connections.length} connection(s)`);
    connections.forEach((conn, index) => {
      console.log(`   ${index + 1}. Connection ID: ${conn.connection_id}`);
      console.log(`      State: ${conn.state}`);
      console.log(`      Label: ${conn.their_label || 'N/A'}`);
    });
    console.log('✅ Connections retrieved\n');

    // Step 7: Get credential exchanges
    console.log('📜 Step 7: Get credential exchanges');
    const credExchanges = await client.getCredentialExchanges();
    console.log(`   Found ${credExchanges.length} credential exchange(s)`);
    if (credExchanges.length > 0) {
      credExchanges.slice(0, 3).forEach((ex, index) => {
        console.log(`   ${index + 1}. Exchange ID: ${ex.credential_exchange_id}`);
        console.log(`      State: ${ex.state}`);
        console.log(`      Connection ID: ${ex.connection_id}`);
      });
    }
    console.log('✅ Credential exchanges retrieved\n');

    // Step 8: Get presentation exchanges
    console.log('🎭 Step 8: Get presentation exchanges');
    const presExchanges = await client.getPresentationExchanges();
    console.log(`   Found ${presExchanges.length} presentation exchange(s)`);
    if (presExchanges.length > 0) {
      presExchanges.slice(0, 3).forEach((ex, index) => {
        console.log(`   ${index + 1}. Exchange ID: ${ex.presentation_exchange_id}`);
        console.log(`      State: ${ex.state}`);
        console.log(`      Verified: ${ex.verified || 'N/A'}`);
      });
    }
    console.log('✅ Presentation exchanges retrieved\n');

    console.log('🎉 Quick start completed successfully!');
    console.log('\n📚 Next steps:');
    console.log('   - Check out examples/simple-connection.ts for connection workflow');
    console.log('   - Check out examples/credential-issuance.ts for credential workflow');
    console.log('   - Check out examples/proof-verification.ts for proof workflow');
    console.log('   - Read the README.md for full API documentation\n');
  } catch (error) {
    console.error('❌ Error occurred:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
  }
}

// Run the quick start
quickStart().catch(console.error);
