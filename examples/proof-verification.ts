import { ACAcpyClient } from '../src';

// Example: Requesting and verifying a proof

async function main() {
  // Initialize clients
  const verifierClient = new ACAcpyClient({
    baseUrl: 'http://localhost:8031', // Verifier agent
    apiKey: 'verifier-api-key',
  });

  const proverClient = new ACAcpyClient({
    baseUrl: 'http://localhost:8032', // Prover agent
    apiKey: 'prover-api-key',
  });

  try {
    console.log('🔄 Starting proof verification workflow...');

    // Step 1: Establish connection (assuming connection already exists)
    console.log('\n📡 Step 1: Getting connections...');
    const verifierConnections = await verifierClient.getConnections();
    const proverConnections = await proverClient.getConnections();

    if (verifierConnections.length === 0 || proverConnections.length === 0) {
      console.error('No connections found. Please establish a connection first.');
      return;
    }

    const connectionId = verifierConnections[0].connection_id;
    console.log('Using connection:', connectionId);

    // Step 2: Send proof request
    console.log('\n📤 Step 2: Sending proof request...');
    const presentationExchange = await verifierClient.sendProofRequest({
      connection_id: connectionId,
      comment: 'Please provide proof of your employee credentials',
      proof_request: {
        name: 'Employment Verification',
        version: '1.0',
        requested_attributes: {
          employee_id: {
            name: 'employee_id',
            restrictions: [
              {
                // Add credential definition ID restriction
                cred_def_id: 'your-cred-def-id',
              },
            ],
          },
          name: {
            name: 'name',
            restrictions: [
              {
                cred_def_id: 'your-cred-def-id',
              },
            ],
          },
          position: {
            name: 'position',
            restrictions: [
              {
                cred_def_id: 'your-cred-def-id',
              },
            ],
          },
        },
        requested_predicates: {},
      },
      trace: true,
    });
    console.log('Proof request sent:', presentationExchange.presentation_exchange_id);

    // Wait for proof to be received
    console.log('\n⏳ Waiting for proof to be presented...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Step 3: Get and verify presentation
    console.log('\n🔍 Step 3: Verifying presentation...');
    const presentation = await verifierClient.getPresentationExchange(
      presentationExchange.presentation_exchange_id
    );
    console.log('Presentation state:', presentation.state);
    console.log('Verification result:', presentation.verified);

    if (presentation.verified === 'true') {
      console.log('✅ Proof verified successfully!');
      console.log('Presentation data:', JSON.stringify(presentation.presentation, null, 2));
    } else {
      console.log('❌ Proof verification failed');
    }

    // Step 4: Check all presentation exchanges
    console.log('\n📋 Step 4: Checking all presentation exchanges...');
    const verifierPresentations = await verifierClient.getPresentationExchanges();
    console.log(`Verifier has ${verifierPresentations.length} presentation exchange(s)`);

    const proverPresentations = await proverClient.getPresentationExchanges();
    console.log(`Prover has ${proverPresentations.length} presentation exchange(s)`);

    console.log('\n✅ Proof verification workflow completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

// Run the example
main().catch(console.error);
