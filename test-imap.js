const imaps = require('imap-simple');

const config = {
    imap: {
        user: "prabinrag2340@gmail.com",
        password: "mtimkenykeabxecu",
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

async function testConnection() {
    console.log(`Connecting to ${config.imap.host} as ${config.imap.user}...`);
    try {
        const connection = await imaps.connect(config);
        console.log('✅ Connection successful!');
        await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER'], struct: true };
        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`Found ${messages.length} unseen messages.`);
        connection.end();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        if (err.message.includes('AUTHENTICATIONFAILED')) {
            console.log('\nTIP: Double check that your App Password is correct and that IMAP is enabled in your Gmail settings.');
        }
    }
}

testConnection();
