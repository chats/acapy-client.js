import { ACAcpyClient } from '../src';

// Example: Complete workflow for issuing a credential

async function main() {
  // Initialize the client
  const issuerClient = new ACAcpyClient({
    baseUrl: 'http://localhost:8031', // Issuer agent
    apiKey: 'issuer-api-key',
  });

  const holderClient = new ACAcpyClient({
    baseUrl: 'http://localhost:8032', // Holder agent
    apiKey: 'holder-api-key',
  });

  try {
    console.log('🔄 Checking agent status...');
    const issuerReady = await issuerClient.isReady();
    const holderReady = await holderClient.isReady();
    console.log(`Issuer ready: ${issuerReady}, Holder ready: ${holderReady}`);

    // Step 1: Create a connection between issuer and holder
    console.log('\n📡 Step 1: Creating connection...');
    const invitation = await issuerClient.createInvitation({
      alias: 'Credential Holder',
      auto_accept: true,
    });
    console.log('Invitation created:', invitation.invitation_url);

    const connection = await holderClient.receiveInvitation(invitation.invitation, {
      alias: 'Credential Issuer',
      auto_accept: true,
    });
    console.log('Connection established:', connection.connection_id);

    // Wait for connection to be active
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Create a schema (issuer only)
    console.log('\n📋 Step 2: Creating schema...');
    const schema = await issuerClient.createSchema({
      schema_name: 'Employee Credential',
      schema_version: '1.0',
      attributes: ['employee_id', 'name', 'position', 'department', 'hire_date'],
    });
    console.log('Schema created:', schema.id);

    // Step 3: Create a credential definition
    console.log('\n🔐 Step 3: Creating credential definition...');
    const credDef = await issuerClient.createCredentialDefinition({
      schema_id: schema.id,
      tag: 'default',
      support_revocation: false,
    });
    console.log('Credential definition created:', credDef.id);

    // Step 4: Send credential offer
    console.log('\n📤 Step 4: Sending credential offer...');
    const credentialExchange = await issuerClient.sendCredentialOffer({
      credential_definition_id: credDef.id,
      connection_id: invitation.connection_id,
      auto_issue: true,
      credential_preview: {
        '@type': 'issue-credential/1.0/credential-preview',
        attributes: [
          { name: 'employee_id', value: 'EMP001' },
          { name: 'name', value: 'Alice Smith' },
          { name: 'position', value: 'Senior Software Engineer' },
          { name: 'department', value: 'Engineering' },
          { name: 'hire_date', value: '2024-01-15' },
        ],
      },
    });
    console.log('Credential offer sent:', credentialExchange.credential_exchange_id);

    // Wait for credential to be received
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 5: Check credential exchanges
    console.log('\n📥 Step 5: Checking credential exchanges...');
    const issuerExchanges = await issuerClient.getCredentialExchanges();
    console.log(`Issuer has ${issuerExchanges.length} credential exchange(s)`);

    const holderExchanges = await holderClient.getCredentialExchanges();
    console.log(`Holder has ${holderExchanges.length} credential exchange(s)`);

    // Step 6: Verify credentials in holder's wallet
    console.log('\n💼 Step 6: Checking wallet...');
    const holderDIDs = await holderClient.getWalletDIDs();
    console.log(`Holder has ${holderDIDs.length} DID(s) in wallet`);

    console.log('\n✅ Credential issuance workflow completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

// Run the example
main().catch(console.error);
