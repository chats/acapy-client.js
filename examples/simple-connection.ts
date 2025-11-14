import { ACAcpyClient } from '../src';

// Example: Basic connection establishment

async function main() {
  // Initialize clients for two agents
  const aliceClient = new ACAcpyClient({
    baseUrl: 'http://localhost:8031',
    apiKey: 'alice-api-key',
  });

  const bobClient = new ACAcpyClient({
    baseUrl: 'http://localhost:8032',
    apiKey: 'bob-api-key',
  });

  try {
    console.log('🔄 Starting connection workflow...');

    // Step 1: Alice creates an invitation
    console.log('\n📤 Step 1: Alice creates an invitation...');
    const invitation = await aliceClient.createInvitation({
      alias: 'Bob',
      auto_accept: true,
      multi_use: false,
    });
    console.log('Invitation URL:', invitation.invitation_url);
    console.log('Connection ID (Alice):', invitation.connection_id);

    // Step 2: Bob receives the invitation
    console.log('\n📥 Step 2: Bob receives the invitation...');
    const bobConnection = await bobClient.receiveInvitation(invitation.invitation, {
      alias: 'Alice',
      auto_accept: true,
    });
    console.log('Connection ID (Bob):', bobConnection.connection_id);

    // Wait for connection to be established
    console.log('\n⏳ Waiting for connection to be established...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 3: Check connection status
    console.log('\n🔍 Step 3: Checking connection status...');
    const aliceConnectionStatus = await aliceClient.getConnection(invitation.connection_id);
    const bobConnectionStatus = await bobClient.getConnection(bobConnection.connection_id);

    console.log(`Alice's connection state: ${aliceConnectionStatus.state}`);
    console.log(`Bob's connection state: ${bobConnectionStatus.state}`);

    // Step 4: List all connections
    console.log('\n📋 Step 4: Listing all connections...');
    const aliceConnections = await aliceClient.getConnections();
    const bobConnections = await bobClient.getConnections();

    console.log(`Alice has ${aliceConnections.length} connection(s)`);
    console.log(`Bob has ${bobConnections.length} connection(s)`);

    // Step 5: Send a basic message
    console.log('\n💬 Step 5: Sending a basic message...');
    await aliceClient.sendBasicMessage({
      connection_id: invitation.connection_id,
      content: 'Hello Bob! Nice to connect with you.',
    });
    console.log('Message sent from Alice to Bob');

    await bobClient.sendBasicMessage({
      connection_id: bobConnection.connection_id,
      content: 'Hi Alice! Great to connect with you too!',
    });
    console.log('Message sent from Bob to Alice');

    console.log('\n✅ Connection workflow completed successfully!');

    // Optional: Clean up connections
    // console.log('\n🧹 Cleaning up connections...');
    // await aliceClient.deleteConnection(invitation.connection_id);
    // await bobClient.deleteConnection(bobConnection.connection_id);
    // console.log('Connections deleted');
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

// Run the example
main().catch(console.error);
